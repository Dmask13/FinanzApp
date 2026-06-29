import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private storage: StorageService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.storage.init();
    const sesion = await this.storage.get('sesion_activa');
    if (sesion && sesion.active === 1) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
