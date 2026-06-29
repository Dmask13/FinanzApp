import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DBTaskService, ExperienciaLaboral } from '../../../services/db-task.service';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
})
export class ExperienciaLaboralComponent implements OnInit {

  lista: ExperienciaLaboral[] = [];
  form: ExperienciaLaboral = {
    empresa: '', anioInicio: new Date().getFullYear(),
    cargo: '', trabajaActualmente: true
  };

  constructor(private db: DBTaskService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.db.crearTablas();
    await this.cargar();
  }

  async cargar() {
    this.lista = await this.db.obtenerExperiencias();
  }

  async agregar() {
    if (!this.form.empresa.trim() || !this.form.cargo.trim()) {
      const a = await this.alertCtrl.create({
        header: 'Campos requeridos', message: 'Completa empresa y cargo.', buttons: ['OK']
      });
      await a.present(); return;
    }
    if (!this.form.trabajaActualmente && !this.form.anioTermino) {
      const a = await this.alertCtrl.create({
        header: 'Año término', message: 'Ingresa el año en que terminaste de trabajar ahí.', buttons: ['OK']
      });
      await a.present(); return;
    }
    await this.db.agregarExperiencia({ ...this.form });
    this.form = { empresa: '', anioInicio: new Date().getFullYear(), cargo: '', trabajaActualmente: true };
    await this.cargar();
  }

  async eliminar(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Eliminar esta experiencia laboral?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: async () => { await this.db.eliminarExperiencia(id); await this.cargar(); } }
      ]
    });
    await alert.present();
  }
}
