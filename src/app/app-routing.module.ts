import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./perfil/perfil.module').then((m) => m.PerfilPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./configuracion/configuracion.module').then((m) => m.ConfiguracionPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'ayuda',
    loadChildren: () =>
      import('./ayuda/ayuda.module').then((m) => m.AyudaPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'api-demo',
    loadChildren: () =>
      import('./api-demo/api-demo.module').then((m) => m.ApiDemoPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'mapa',
    loadChildren: () =>
      import('./mapa/mapa.module').then((m) => m.MapaPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'camara',
    loadChildren: () =>
      import('./camara/camara.module').then((m) => m.CamaraPageModule),
    canActivate: [AuthGuard],
  },
  // ── 404 - SIEMPRE AL FINAL ──
  {
    path: '**',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
