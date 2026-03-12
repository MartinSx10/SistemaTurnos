import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReservasApiService, Reserva } from '../../services/reservas-api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent implements OnInit {
  filtroFecha = '';
  username = 'admin';
  password = '';
  loginError = '';
  reservas: Reserva[] = [];
  cargando = false;
  mostrarPassword = false;


  constructor(
    public authService: AuthService,
    private reservasApi: ReservasApiService,
    private cdr: ChangeDetectorRef
  ) {}

  togglePassword(): void {
  this.mostrarPassword = !this.mostrarPassword;
}

  ngOnInit(): void {
    if (this.estaLogueado) {
      this.cargarReservas();
    }
  }

  get estaLogueado(): boolean {
    return this.authService.isLoggedIn();
  }

  login(): void {
    this.loginError = '';
    this.cargando = true;
    this.cdr.detectChanges();

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.password = '';
        this.cargarReservas();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loginError = 'Usuario o contraseña incorrectos.';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.filtroFecha = '';
    this.reservas = [];
    this.password = '';
    this.loginError = '';
    this.cdr.detectChanges();
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

  cargarReservas(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.reservasApi.getReservas(this.filtroFecha || undefined).subscribe({
      next: (data) => {
        this.reservas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFiltroChange(): void {
    this.cargarReservas();
  }

  eliminar(id: number): void {
    this.reservasApi.eliminarReserva(id).subscribe({
      next: () => {
        this.cargarReservas();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      },
    });
  }

  cambiarEstado(id: number, event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.reservasApi
      .cambiarEstado(id, select.value as 'reservado' | 'pagado' | 'cancelado')
      .subscribe({
        next: () => {
          this.cargarReservas();
          this.cdr.detectChanges();
        },
        error: () => {
          this.cdr.detectChanges();
        },
      });
  }

  limpiarFiltro(): void {
    this.filtroFecha = '';
    this.cargarReservas();
    this.cdr.detectChanges();
  }

  limpiarTodas(): void {
    const confirmar = confirm('¿Seguro que querés eliminar todas las reservas?');
    if (!confirmar) return;

    const eliminaciones = this.reservas.map((r) =>
      this.reservasApi.eliminarReserva(r.id).toPromise()
    );

    Promise.all(eliminaciones).then(() => {
      this.cargarReservas();
      this.cdr.detectChanges();
    });
  }
}