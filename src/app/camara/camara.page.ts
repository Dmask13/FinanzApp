import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

interface FotoRegistro {
  id: number;
  dataUrl: string;
  descripcion: string;
  fecha: string;
}

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage {

  fotoActual: string | null = null;
  descripcion: string = '';
  fotos: FotoRegistro[] = [];
  private nextId = 1;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private storage: StorageService
  ) {}

  async ionViewWillEnter() {
    await this.storage.init();
    const guardadas = await this.storage.get('fotos_camara');
    if (guardadas) {
      this.fotos = guardadas;
      this.nextId = this.fotos.length > 0
        ? Math.max(...this.fotos.map((f: FotoRegistro) => f.id)) + 1 : 1;
    }
  }

  // Abre el selector de archivo (cámara en móvil, galería en web)
  abrirCamara() {
    const input = document.getElementById('inputFoto') as HTMLInputElement;
    input?.click();
  }

  // Lee el archivo seleccionado y lo convierte a base64
  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fotoActual = e.target?.result as string;
    };
    reader.readAsDataURL(archivo);
    // Limpiar el input para que permita seleccionar la misma foto de nuevo
    input.value = '';
  }

  // Guarda la foto actual con descripción
  async guardarFoto() {
    if (!this.fotoActual) {
      const a = await this.alertCtrl.create({
        header: 'Sin foto', message: 'Primero toma o selecciona una foto.', buttons: ['OK']
      });
      await a.present(); return;
    }

    const nueva: FotoRegistro = {
      id: this.nextId++,
      dataUrl: this.fotoActual,
      descripcion: this.descripcion || 'Sin descripción',
      fecha: new Date().toLocaleString('es-CL'),
    };
    this.fotos.unshift(nueva);
    await this.storage.set('fotos_camara', this.fotos);

    this.fotoActual = null;
    this.descripcion = '';

    const a = await this.alertCtrl.create({
      header: '✅ Foto guardada', message: 'La imagen se guardó en Storage.', buttons: ['OK']
    });
    await a.present();
  }

  async eliminarFoto(id: number) {
    const confirm = await this.alertCtrl.create({
      header: 'Eliminar foto',
      message: '¿Seguro que deseas eliminar esta foto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            this.fotos = this.fotos.filter(f => f.id !== id);
            await this.storage.set('fotos_camara', this.fotos);
          }
        }
      ]
    });
    await confirm.present();
  }

  volver() { this.router.navigate(['/home']); }
}
