import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  filtroFecha = '';
  password = '';
  loginError = '';

  constructor(
    public reservasService: ReservasService,
    public authService: AuthService
  ) {}

  get estaLogueado(): boolean {
    return this.authService.isLoggedIn();
  }

  login(): void {
    this.loginError = '';

    const ok = this.authService.login(this.password);

    if (!ok) {
      this.loginError = 'Contraseña incorrecta.';
      return;
    }

    this.password = '';
  }

  logout(): void {
    this.authService.logout();
    this.filtroFecha = '';
  }

  get reservas(): Reserva[] {
    const reservas = this.reservasService.getReservas();

    const filtradas = !this.filtroFecha
      ? reservas
      : reservas.filter((reserva) => reserva.fecha === this.filtroFecha);

    return [...filtradas].sort((a, b) => {
      const fechaHoraA = `${a.fecha}T${a.hora}`;
      const fechaHoraB = `${b.fecha}T${b.hora}`;

      return new Date(fechaHoraA).getTime() - new Date(fechaHoraB).getTime();
    });
  }

  get totalReservas(): number {
    return this.reservas.length;
  }

  get totalReservadas(): number {
    return this.reservas.filter((r) => r.estado === 'reservado').length;
  }

  get totalPagadas(): number {
    return this.reservas.filter((r) => r.estado === 'pagado').length;
  }

  get totalCanceladas(): number {
    return this.reservas.filter((r) => r.estado === 'cancelado').length;
  }

  eliminar(id: string): void {
    this.reservasService.eliminarReserva(id);
  }

  cambiarEstado(id: string, event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.reservasService.cambiarEstado(
      id,
      select.value as 'reservado' | 'pagado' | 'cancelado'
    );
  }

  limpiarFiltro(): void {
    this.filtroFecha = '';
  }

  limpiarTodas(): void {
    const confirmar = confirm('¿Seguro que querés eliminar todas las reservas?');

    if (!confirmar) return;

    this.reservasService.limpiarReservas();
    this.filtroFecha = '';
  }
}