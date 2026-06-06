import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  usuario: string = '';
  password: string = '';

  constructor(private router: Router, private alertCtrl: AlertController) {}

  // Valida usuario: alfanumérico, mínimo 3, máximo 8 caracteres
  validarUsuario(): boolean {
    const regex = /^[a-zA-Z0-9]{3,8}$/;
    return regex.test(this.usuario);
  }

  // Valida contraseña: exactamente 4 dígitos numéricos
  validarPassword(): boolean {
    const regex = /^\d{4}$/;
    return regex.test(this.password);
  }

  async ingresar() {
    if (!this.validarUsuario()) {
      const alert = await this.alertCtrl.create({
        header: 'Error de validación',
        message: 'El usuario debe ser alfanumérico, mínimo 3 y máximo 8 caracteres.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (!this.validarPassword()) {
      const alert = await this.alertCtrl.create({
        header: 'Error de validación',
        message: 'La contraseña debe ser numérica y tener exactamente 4 dígitos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Pasar datos al Home usando NavigationExtras
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
      },
    };

    this.router.navigate(['/home'], navigationExtras);
  }
}
