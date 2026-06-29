import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ApiDemoPage } from './api-demo.page';

const routes: Routes = [{ path: '', component: ApiDemoPage }];

@NgModule({
  declarations: [ApiDemoPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
})
export class ApiDemoPageModule {}
