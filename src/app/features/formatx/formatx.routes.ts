import { Routes } from '@angular/router';

export const FORMATX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/formatx/formatx.component').then((m) => m.FormatxComponent)
  }
];
