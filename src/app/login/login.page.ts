import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DBTaskService } from '../services/db-task.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // Login
  usuario: string = '';
  password: string = '';
  cargando: boolean = false;

  // Registro
  modoActivo: string = 'login';
  nuevoUsuario: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private db: DBTaskService,
    private storage: StorageService
  ) {}

  async ngOnInit() {
    await this.db.crearTablas();
    // Si ya hay sesión activa → ir directo al Home
    const sesionActiva = await this.db.existeSesionActiva();
    if (sesionActiva) {
      const extras: NavigationExtras = { state: { usuario: sesionActiva.user_name } };
      this.router.navigate(['/home'], extras);
    }
  }

  // ── Validaciones ─────────────────────────────────────────────
  validarUsuario(u: string): boolean {
    return /^[a-zA-Z0-9]{3,8}$/.test(u);
  }

  validarPassword(p: string): boolean {
    return /^\d{4}$/.test(p);
  }

  // ── Login ─────────────────────────────────────────────────────
  async ingresar() {
    if (!this.validarUsuario(this.usuario)) {
      await this.mostrarAlerta('Error de validación', 'El usuario debe ser alfanumérico, mínimo 3 y máximo 8 caracteres.');
      return;
    }
    if (!this.validarPassword(this.password)) {
      await this.mostrarAlerta('Error de validación', 'La contraseña debe ser numérica y tener exactamente 4 dígitos.');
      return;
    }

    this.cargando = true;
    const valido = await this.db.validarUsuario(this.usuario, this.password);
    this.cargando = false;

    if (!valido) {
      await this.mostrarAlerta('Acceso denegado', 'Usuario o contraseña incorrectos.');
      return;
    }

    // Registrar sesión activa en DB y Storage
    await this.db.actualizarEstadoSesion(this.usuario, 1);
    await this.storage.set('sesion_activa', { user_name: this.usuario, active: 1 });

    const extras: NavigationExtras = { state: { usuario: this.usuario } };
    this.router.navigate(['/home'], extras);
  }

  // ── Registro ──────────────────────────────────────────────────
  async registrarse() {
    if (!this.validarUsuario(this.nuevoUsuario)) {
      await this.mostrarAlerta('Error', 'El usuario debe ser alfanumérico, mínimo 3 y máximo 8 caracteres.');
      return;
    }
    if (!this.validarPassword(this.nuevaPassword)) {
      await this.mostrarAlerta('Error', 'La contraseña debe tener exactamente 4 dígitos numéricos.');
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      await this.mostrarAlerta('Error', 'Las contraseñas no coinciden.');
      return;
    }

    // Verificar que el usuario no exista ya
    const yaExiste = await this.db.existeUsuario(this.nuevoUsuario);
    if (yaExiste) {
      await this.mostrarAlerta('Error', `El usuario "${this.nuevoUsuario}" ya está registrado.`);
      return;
    }

    // Registrar en DB → queda activo inmediatamente
    await this.db.registrarSesion(this.nuevoUsuario, this.nuevaPassword);
    await this.storage.set('sesion_activa', { user_name: this.nuevoUsuario, active: 1 });

    await this.mostrarAlerta('✅ Registro exitoso', `Bienvenido, ${this.nuevoUsuario}! Tu cuenta ha sido creada.`);
    const extras: NavigationExtras = { state: { usuario: this.nuevoUsuario } };
    this.router.navigate(['/home'], extras);
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
