import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

interface Gasto {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {

  descripcion = '';
  monto = '';
  categoria = '';
  fecha = '';

  categorias: string[] = [
    'Alimentación', 'Transporte', 'Entretenimiento',
    'Salud', 'Educación', 'Ropa', 'Hogar', 'Otros'
  ];

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private animationCtrl: AnimationController,
    private storage: StorageService
  ) {}

  ionViewDidEnter() {
    const form = document.querySelector('.form-card') as HTMLElement;
    if (form) {
      this.animationCtrl.create()
        .addElement(form).duration(600).iterations(1)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateY(30px)' },
          { offset: 1, opacity: '1', transform: 'translateY(0)' },
        ]).play();
    }
  }

  async registrar() {
    if (!this.descripcion.trim() || !this.monto || !this.categoria) {
      const a = await this.alertCtrl.create({
        header: 'Campos incompletos',
        message: 'Debes ingresar descripción, monto y categoría.',
        buttons: ['OK'],
      });
      await a.present(); return;
    }

    // Guardar gasto en Storage (persistencia)
    await this.storage.init();
    const gastos: Gasto[] = (await this.storage.get('gastos_lista')) || [];
    gastos.push({
      descripcion: this.descripcion,
      monto: parseInt(this.monto),
      categoria: this.categoria,
      fecha: this.fecha || new Date().toLocaleDateString('es-CL'),
    });
    await this.storage.set('gastos_lista', gastos);

    const a = await this.alertCtrl.create({
      header: '✅ Gasto registrado',
      message: `${this.descripcion} – $${parseInt(this.monto).toLocaleString('es-CL')} guardado en Storage.`,
      buttons: [{ text: 'Aceptar', handler: () => { this.limpiar(); } }],
    });
    await a.present();
  }

  limpiar() {
    this.descripcion = ''; this.monto = ''; this.categoria = ''; this.fecha = '';
  }

  volver() { this.router.navigate(['/home']); }
}
