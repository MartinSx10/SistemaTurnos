import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ReservasComponent } from './pages/reservas/reservas';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'admin', component: AdminComponent },
];