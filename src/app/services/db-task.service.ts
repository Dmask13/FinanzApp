import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

// ── Modelos / Interfaces ──────────────────────────────────────
export interface Sesion {
  user_name: string;   // TEXT (8) PK NOT NULL
  password: string;    // INTEGER NOT NULL (almacenado como string)
  active: number;      // INTEGER NOT NULL  0=inactivo | 1=activo
}

export interface ExperienciaLaboral {
  id?: number;
  empresa: string;
  anioInicio: number;
  trabajaActualmente: boolean;
  anioTermino?: number;
  cargo: string;
}

export interface Certificacion {
  id?: number;
  nombreCertificado: string;
  fechaObtencion: string;
  tieneVencimiento: boolean;
  fechaVencimiento?: string;
}

// ─────────────────────────────────────────────────────────────
// DBTaskService
// Servicio encargado de ejecutar las operaciones sobre la base
// de datos. Usa @ionic/storage-angular que en dispositivo físico
// utiliza SQLite y en navegador utiliza IndexedDB.
// ─────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class DBTaskService {

  // Tablas en memoria (espejo de los datos persistidos en Storage/SQLite)
  private sesiones: Sesion[] = [];
  private experiencias: ExperienciaLaboral[] = [];
  private certificaciones: Certificacion[] = [];
  private nextExpId = 1;
  private nextCertId = 1;
  private dbReady = false;

  constructor(private storage: StorageService) {}

  // ── Función que genera las tablas necesarias ──────────────────
  async crearTablas(): Promise<void> {
    if (this.dbReady) return;

    // Inicializar Storage (SQLite en dispositivo / IndexedDB en web)
    await this.storage.init();

    // Cargar datos persistidos (equivalente a SELECT * FROM tabla)
    const sesiones       = await this.storage.get('db_sesiones');
    const experiencias   = await this.storage.get('db_experiencias');
    const certificaciones = await this.storage.get('db_certificaciones');

    // Datos por defecto si las "tablas" están vacías
    this.sesiones = sesiones || [
      { user_name: 'admin',  password: '1234', active: 0 },
      { user_name: 'juan01', password: '4321', active: 0 },
    ];
    this.experiencias    = experiencias    || [];
    this.certificaciones = certificaciones || [];

    // Recalcular IDs auto-increment
    this.nextExpId  = this.experiencias.length > 0
      ? Math.max(...this.experiencias.map((e: ExperienciaLaboral) => e.id ?? 0)) + 1 : 1;
    this.nextCertId = this.certificaciones.length > 0
      ? Math.max(...this.certificaciones.map((c: Certificacion) => c.id ?? 0)) + 1 : 1;

    this.dbReady = true;
    console.log('DBTask: tablas listas (Storage/SQLite inicializado)');
  }

  // ── Función que setea el objeto Storage (equivalente a SQLiteObject) ──
  async setSQLiteObject(): Promise<void> {
    await this.storage.init();
    console.log('DBTask: SQLiteObject seteado');
  }

  // ── Persistencia (equivalente a INSERT/UPDATE en SQLite) ──────
  private async persistirSesiones()        { await this.storage.set('db_sesiones',        this.sesiones); }
  private async persistirExperiencias()    { await this.storage.set('db_experiencias',    this.experiencias); }
  private async persistirCertificaciones() { await this.storage.set('db_certificaciones', this.certificaciones); }

  // ── Función que consulta si existe alguna sesión activa ───────
  async existeSesionActiva(): Promise<Sesion | null> {
    await this.crearTablas();
    return this.sesiones.find(s => s.active === 1) ?? null;
  }

  // ── Función que valida la existencia de un usuario ────────────
  async validarUsuario(userName: string, password: string): Promise<boolean> {
    await this.crearTablas();
    return !!this.sesiones.find(s => s.user_name === userName && s.password === password);
  }

  // ── Verifica si un nombre de usuario ya existe (registro) ─────
  async existeUsuario(userName: string): Promise<boolean> {
    await this.crearTablas();
    return !!this.sesiones.find(s => s.user_name === userName);
  }

  // ── Función que permite el registro de una sesión ─────────────
  async registrarSesion(userName: string, password: string): Promise<void> {
    await this.crearTablas();
    this.sesiones.forEach(s => s.active = 0);  // solo una sesión activa a la vez
    const existe = this.sesiones.find(s => s.user_name === userName);
    if (!existe) {
      this.sesiones.push({ user_name: userName, password, active: 1 });
    } else {
      existe.active = 1;
    }
    await this.persistirSesiones();
  }

  // ── Función que actualiza el estado active de una sesión ──────
  async actualizarEstadoSesion(userName: string, active: number): Promise<void> {
    await this.crearTablas();
    this.sesiones.forEach(s => s.active = 0);
    const s = this.sesiones.find(s => s.user_name === userName);
    if (s) s.active = active;
    await this.persistirSesiones();
  }

  // ── Cierra todas las sesiones (logout) ───────────────────────
  async cerrarTodasSesiones(): Promise<void> {
    await this.crearTablas();
    this.sesiones.forEach(s => s.active = 0);
    await this.persistirSesiones();
  }

  // ── CRUD Experiencia Laboral ──────────────────────────────────
  async agregarExperiencia(exp: ExperienciaLaboral): Promise<void> {
    await this.crearTablas();
    exp.id = this.nextExpId++;
    this.experiencias.push({ ...exp });
    await this.persistirExperiencias();
  }

  async obtenerExperiencias(): Promise<ExperienciaLaboral[]> {
    await this.crearTablas();
    return [...this.experiencias];
  }

  async eliminarExperiencia(id: number): Promise<void> {
    await this.crearTablas();
    this.experiencias = this.experiencias.filter(e => e.id !== id);
    await this.persistirExperiencias();
  }

  // ── CRUD Certificaciones ──────────────────────────────────────
  async agregarCertificacion(cert: Certificacion): Promise<void> {
    await this.crearTablas();
    cert.id = this.nextCertId++;
    this.certificaciones.push({ ...cert });
    await this.persistirCertificaciones();
  }

  async obtenerCertificaciones(): Promise<Certificacion[]> {
    await this.crearTablas();
    return [...this.certificaciones];
  }

  async eliminarCertificacion(id: number): Promise<void> {
    await this.crearTablas();
    this.certificaciones = this.certificaciones.filter(c => c.id !== id);
    await this.persistirCertificaciones();
  }
}
