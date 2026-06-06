import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

interface Gasto {
  descripcion: string;
  monto: number;
  categoria: string;
  icono: string;
  fecha: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  usuarioLogin: string = '';
  nombre: string = '';

  // Gastos de ejemplo para el dashboard
  gastosRecientes: Gasto[] = [
    { descripcion: 'Supermercado', monto: 28500, categoria: 'Alimentación', icono: 'cart-outline', fecha: 'Hoy' },
    { descripcion: 'Metro / Bus', monto: 4200, categoria: 'Transporte', icono: 'bus-outline', fecha: 'Hoy' },
    { descripcion: 'Netflix', monto: 8990, categoria: 'Entretenimiento', icono: 'play-circle-outline', fecha: 'Ayer' },
    { descripcion: 'Farmacia', monto: 12300, categoria: 'Salud', icono: 'medkit-outline', fecha: 'Ayer' },
  ];

  get totalMes(): number {
    return this.gastosRecientes.reduce((sum, g) => sum + g.monto, 0);
  }

  constructor(private router: Router, private animationCtrl: AnimationController) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.usuarioLogin = nav.extras.state['usuario'] || '';
      this.nombre = nav.extras.state['nombre'] || this.usuarioLogin;
    }
  }

  ionViewDidEnter() {
    // Animación 1: saldo total aparece con fade desde abajo
    const saldoCard = document.querySelector('.saldo-card') as HTMLElement;
    if (saldoCard) {
      this.animationCtrl.create()
        .addElement(saldoCard)
        .duration(700)
        .iterations(1)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateY(-24px)' },
          { offset: 1, opacity: '1', transform: 'translateY(0px)' },
        ]).play();
    }

    // Animación 2: cada item de gasto entra con slide desde la derecha
    const items = document.querySelectorAll('.gasto-item');
    items.forEach((el, i) => {
      this.animationCtrl.create()
        .addElement(el as HTMLElement)
        .duration(400)
        .delay(100 + i * 80)
        .iterations(1)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateX(30px)' },
          { offset: 1, opacity: '1', transform: 'translateX(0px)' },
        ]).play();
    });
  }

  formatMonto(monto: number): string {
    return `$${monto.toLocaleString('es-CL')}`;
  }

  irARegistrar() {
    this.router.navigate(['/perfil'], {
      state: { usuario: this.usuarioLogin, nombre: this.nombre }
    });
  }

  irAResumen() {
    this.router.navigate(['/configuracion'], {
      state: { gastos: this.gastosRecientes }
    });
  }

  irAAyuda() {
    this.router.navigate(['/ayuda']);
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}
