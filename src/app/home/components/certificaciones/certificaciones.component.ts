import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DBTaskService, Certificacion } from '../../../services/db-task.service';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
})
export class CertificacionesComponent implements OnInit {

  lista: Certificacion[] = [];
  form: Certificacion = { nombreCertificado: '', fechaObtencion: '', tieneVencimiento: false };

  constructor(private db: DBTaskService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.db.crearTablas();
    await this.cargar();
  }

  async cargar() {
    this.lista = await this.db.obtenerCertificaciones();
  }

  async agregar() {
    if (!this.form.nombreCertificado.trim() || !this.form.fechaObtencion) {
      const a = await this.alertCtrl.create({
        header: 'Campos requeridos', message: 'Completa nombre y fecha de obtención.', buttons: ['OK']
      });
      await a.present(); return;
    }
    if (this.form.tieneVencimiento && !this.form.fechaVencimiento) {
      const a = await this.alertCtrl.create({
        header: 'Fecha de vencimiento', message: 'Ingresa la fecha de vencimiento del certificado.', buttons: ['OK']
      });
      await a.present(); return;
    }
    await this.db.agregarCertificacion({ ...this.form });
    this.form = { nombreCertificado: '', fechaObtencion: '', tieneVencimiento: false };
    await this.cargar();
  }

  async eliminar(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta certificación?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: async () => { await this.db.eliminarCertificacion(id); await this.cargar(); } }
      ]
    });
    await alert.present();
  }
}
