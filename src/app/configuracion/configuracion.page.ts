import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

interface ResumenCategoria {
  nombre: string;
  monto: number;
  icono: string;
  color: string;
  porcentaje: number;
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage {

  mesActual = 'Junio 2025';
  presupuesto = 300000;

  categorias: ResumenCategoria[] = [
    { nombre: 'Alimentación',    monto: 85000,  icono: 'cart-outline',         color: '#3B82F6', porcentaje: 32 },
    { nombre: 'Transporte',      monto: 42000,  icono: 'bus-outline',           color: '#8B5CF6', porcentaje: 16 },
    { nombre: 'Entretenimiento', monto: 35000,  icono: 'play-circle-outline',   color: '#F59E0B', porcentaje: 13 },
    { nombre: 'Salud',           monto: 28000,  icono: 'medkit-outline',        color: '#EF4444', porcentaje: 10 },
    { nombre: 'Hogar',           monto: 54000,  icono: 'home-outline',          color: '#10B981', porcentaje: 20 },
    { nombre: 'Otros',           monto: 24000,  icono: 'ellipsis-horizontal-outline', color: '#94A3B8', porcentaje: 9 },
  ];

  get totalGastado(): number {
    return this.categorias.reduce((sum, c) => sum + c.monto, 0);
  }

  get porcentajeUsado(): number {
    return Math.round((this.totalGastado / this.presupuesto) * 100);
  }

  get saldoRestante(): number {
    return this.presupuesto - this.totalGastado;
  }

  constructor(private router: Router, private animationCtrl: AnimationController) {}

  ionViewDidEnter() {
    // Animación: cards de categorías entran en cascada de izquierda a derecha
    const cards = document.querySelectorAll('.categoria-card');
    cards.forEach((el, i) => {
      this.animationCtrl.create()
        .addElement(el as HTMLElement)
        .duration(450)
        .delay(i * 80)
        .iterations(1)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateX(-30px)' },
          { offset: 1, opacity: '1', transform: 'translateX(0px)' },
        ]).play();
    });
  }

  formatMonto(monto: number): string {
    return `$${monto.toLocaleString('es-CL')}`;
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
