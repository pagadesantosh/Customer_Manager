import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    loadComponent: () => import('./customers/pages/customers-page.component').then(m => m.CustomersPageComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/pages/orders-page.component').then(m => m.OrdersPageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: '**',
    redirectTo: '/customers'
  }
];
