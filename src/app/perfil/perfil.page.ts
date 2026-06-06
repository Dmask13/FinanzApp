import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  descripcion: string = '';
  monto: string = '';
  categoria: string = '';
  fecha: string = '';

  categorias: string[] = [
    'Alimentación', 'Transporte', 'Entretenimiento',
    'Salud', 'Educación', 'Ropa', 'Hogar', 'Otros'
  ];

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private animationCtrl: AnimationController
  ) {}

  ionViewDidEnter() {
    // Animación: el formulario entra con fade desde abajo
    const form = document.querySelector('.form-card') as HTMLElement;
    if (form) {
      this.animationCtrl.create()
        .addElement(form)
        .duration(600)
        .iterations(1)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateY(30px)' },
          { offset: 1, opacity: '1', transform: 'translateY(0)' },
        ]).play();
    }
  }

  async limpiar() {
    this.descripcion = '';
    this.monto = '';
    this.categoria = '';
    this.fecha = '';

    // Animación izquierda→derecha en los inputs al limpiar
    const inputDesc   = document.querySelector('#input-descripcion') as HTMLElement;
    const inputMonto  = document.querySelector('#input-monto') as HTMLElement;

    const anims: Promise<void>[] = [];
    [inputDesc, inputMonto].forEach(el => {
      if (el) anims.push(
        this.animationCtrl.create()
          .addElement(el)
          .duration(1000)
          .iterations(1)
          .keyframes([
            { offset: 0,   transform: 'translateX(-40px)', opacity: '0.3' },
            { offset: 0.6, transform: 'translateX(10px)',  opacity: '1'   },
            { offset: 1,   transform: 'translateX(0px)',   opacity: '1'   },
          ]).play()
      );
    });
    await Promise.all(anims);
  }

  async registrar() {
    if (!this.descripcion.trim() || !this.monto || !this.categoria) {
      const alerta = await this.alertCtrl.create({
        header: 'Campos incompletos',
        message: 'Debes ingresar descripción, monto y categoría.',
        buttons: ['OK'],
      });
      await alerta.present();
      return;
    }

    const alerta = await this.alertCtrl.create({
      header: '✅ Gasto registrado',
      message: `${this.descripcion}\nMonto: $${parseInt(this.monto).toLocaleString('es-CL')}\nCategoría: ${this.categoria}`,
      buttons: [{
        text: 'Aceptar',
        handler: () => { this.limpiar(); }
      }],
    });
    await alerta.present();
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
