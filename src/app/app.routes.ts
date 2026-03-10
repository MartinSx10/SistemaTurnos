import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Reservas } from './pages/reservas/reservas';
import { Admin } from './pages/admin/admin';
import { Navbar } from './components/navbar/navbar';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'reservas', component: Reservas },
  { path: 'admin', component: Admin },
  {path: 'navbar', component: Navbar}
];
