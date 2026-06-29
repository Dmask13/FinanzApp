import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { DBTaskService } from '../services/db-task.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuarioLogin: string = '';
  segmentoActivo: string = 'misDatos';

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private db: DBTaskService,
    private storage: StorageService
  ) {
    // Intentar capturar el usuario desde el state de navegación
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.usuarioLogin = nav.extras.state['usuario'] || '';
    }
  }

  async ngOnInit() {
    // Si no vino por navegación, recuperarlo desde Storage
    if (!this.usuarioLogin) {
      await this.storage.init();
      const sesion = await this.storage.get('sesion_activa');
      if (sesion) this.usuarioLogin = sesion.user_name;
    }
  }

  ionViewDidEnter() {
    const header = document.querySelector('.home-header-section') as HTMLElement;
    if (header) {
      this.animationCtrl.create()
        .addElement(header)
        .duration(600)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'translateY(-20px)' },
          { offset: 1, opacity: '1', transform: 'translateY(0)' },
        ]).play();
    }
  }

  cambiarSegmento(event: any) {
    this.segmentoActivo = event.detail.value;
  }

  irARegistrar()  { this.router.navigate(['/perfil'],        { state: { usuario: this.usuarioLogin } }); }
  irAResumen()    { this.router.navigate(['/configuracion']); }
  irAApiDemo()    { this.router.navigate(['/api-demo']);      }
  irAMapa()       { this.router.navigate(['/mapa']);          }
  irACamara()     { this.router.navigate(['/camara']);        }
  irAAyuda()      { this.router.navigate(['/ayuda']);         }

  async cerrarSesion() {
    await this.db.cerrarTodasSesiones();
    await this.storage.remove('sesion_activa');
    this.router.navigate(['/login']);
  }
}
