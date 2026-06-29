import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

interface Gasto {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

interface ResumenCategoria {
  nombre: string;
  monto: number;
  icono: string;
  color: string;
  porcentaje: number;
}

const ICONOS: Record<string, string> = {
  'Alimentación': 'cart-outline',
  'Transporte': 'bus-outline',
  'Entretenimiento': 'play-circle-outline',
  'Salud': 'medkit-outline',
  'Educación': 'school-outline',
  'Ropa': 'shirt-outline',
  'Hogar': 'home-outline',
  'Otros': 'ellipsis-horizontal-outline',
};

const COLORES: Record<string, string> = {
  'Alimentación': '#3B82F6', 'Transporte': '#8B5CF6',
  'Entretenimiento': '#F59E0B', 'Salud': '#EF4444',
  'Educación': '#06B6D4', 'Ropa': '#EC4899',
  'Hogar': '#10B981', 'Otros': '#94A3B8',
};

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage {

  mesActual = new Date().toLocaleString('es-CL', { month: 'long', year: 'numeric' });
  presupuesto = 300000;
  categorias: ResumenCategoria[] = [];
  gastosDetalle: Gasto[] = [];

  get totalGastado()    { return this.categorias.reduce((s, c) => s + c.monto, 0); }
  get porcentajeUsado() { return this.presupuesto > 0 ? Math.min(Math.round((this.totalGastado / this.presupuesto) * 100), 100) : 0; }
  get saldoRestante()   { return this.presupuesto - this.totalGastado; }

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private storage: StorageService
  ) {}

  // ionViewWillEnter: carga datos y LUEGO anima (evita race condition)
  async ionViewWillEnter() {
    await this.cargarGastos();
    // Animar después de que el DOM se actualice con los datos cargados
    setTimeout(() => this.animarCategorias(), 80);
  }

  async cargarGastos() {
    await this.storage.init();
    this.gastosDetalle = (await this.storage.get('gastos_lista')) || [];

    const mapa: Record<string, number> = {};
    this.gastosDetalle.forEach((g: Gasto) => {
      mapa[g.categoria] = (mapa[g.categoria] || 0) + g.monto;
    });

    const total = Object.values(mapa).reduce((s, v) => s + v, 0) || 1;
    this.categorias = Object.entries(mapa).map(([nombre, monto]) => ({
      nombre, monto,
      icono:  ICONOS[nombre]  || 'help-circle-outline',
      color:  COLORES[nombre] || '#94A3B8',
      porcentaje: Math.round((monto / total) * 100),
    }));

    // Ejemplo si no hay gastos registrados aún
    if (this.categorias.length === 0) {
      this.categorias = [
        { nombre: 'Sin gastos', monto: 0, icono: 'wallet-outline', color: '#94A3B8', porcentaje: 0 }
      ];
    }
  }

  animarCategorias() {
    const cards = document.querySelectorAll('.categoria-card');
    cards.forEach((el, i) => {
      this.animationCtrl.create()
        .addElement(el as HTMLElement)
        .duration(400)
        .delay(i * 70)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateX(-24px)' },
          { offset: 1, opacity: '1', transform: 'translateX(0)' },
        ]).play();
    });
  }

  formatMonto(monto: number) { return `$${monto.toLocaleString('es-CL')}`; }
  volver() { this.router.navigate(['/home']); }
}
