import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CamaraPage } from './camara.page';

const routes: Routes = [{ path: '', component: CamaraPage }];

@NgModule({
  declarations: [CamaraPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
})
export class CamaraPageModule {}
