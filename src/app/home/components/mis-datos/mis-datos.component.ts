import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
})
export class MisDatosComponent implements OnInit {

  nombre    = '';
  email     = '';
  telefono  = '';
  profesion = '';
  guardado  = false;

  constructor(private storage: StorageService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.storage.init();
    const datos = await this.storage.get('mis_datos');
    if (datos) {
      this.nombre    = datos.nombre    || '';
      this.email     = datos.email     || '';
      this.telefono  = datos.telefono  || '';
      this.profesion = datos.profesion || '';
    }
  }

  async guardar() {
    if (!this.nombre.trim()) {
      const a = await this.alertCtrl.create({
        header: 'Campo requerido', message: 'El nombre no puede estar vacío.', buttons: ['OK']
      });
      await a.present(); return;
    }
    await this.storage.set('mis_datos', {
      nombre: this.nombre, email: this.email,
      telefono: this.telefono, profesion: this.profesion
    });
    this.guardado = true;
    setTimeout(() => this.guardado = false, 3000);
  }
}
