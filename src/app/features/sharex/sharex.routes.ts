import { Routes } from '@angular/router';

export const SHAREX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/sharex-layout.component').then((m) => m.SharexLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/sharex-home.component').then((m) => m.SharexHomeComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/create/sharex-create.component').then((m) => m.SharexCreateComponent)
      },
      {
        path: 's/:code',
        loadComponent: () => import('./pages/view/sharex-view.component').then((m) => m.SharexViewComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/sharex-about.component').then((m) => m.SharexAboutComponent)
      }
    ]
  }
];
