import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { MisDatosComponent } from './components/mis-datos/mis-datos.component';
import { ExperienciaLaboralComponent } from './components/experiencia-laboral/experiencia-laboral.component';
import { CertificacionesComponent } from './components/certificaciones/certificaciones.component';

@NgModule({
  declarations: [
    HomePage,
    MisDatosComponent,
    ExperienciaLaboralComponent,
    CertificacionesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
})
export class HomePageModule {}
