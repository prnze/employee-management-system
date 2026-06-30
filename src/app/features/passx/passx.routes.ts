import { Routes } from '@angular/router';

export const PASSX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/passx/passx.component').then((m) => m.PassxComponent)
  }
];
