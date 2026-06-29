import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage {

  constructor(private router: Router, private animationCtrl: AnimationController) {}

  ionViewDidEnter() {
    const titulo = document.querySelector('.ayuda-titulo') as HTMLElement;
    if (titulo) {
      this.animationCtrl.create()
        .addElement(titulo)
        .duration(600)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0.8)' },
          { offset: 1, opacity: '1', transform: 'scale(1)' },
        ]).play();
    }
  }

  volver() { this.router.navigate(['/home']); }
}
