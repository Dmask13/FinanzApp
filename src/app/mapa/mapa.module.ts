import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { MapaPage } from './mapa.page';

const routes: Routes = [{ path: '', component: MapaPage }];

@NgModule({
  declarations: [MapaPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class MapaPageModule {}
