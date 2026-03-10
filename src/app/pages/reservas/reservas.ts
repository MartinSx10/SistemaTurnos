import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasApiService, Reserva } from '../../services/reservas-api.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.scss',
})
export class ReservasComponent {
  horarios: string[] = [
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  reservasDelDia: Reserva[] = [];

  reserva = {
    fecha: '',
    hora: '',
    nombre: '',
    telefono: '',
  };

  mensaje = '';
  error = '';
  cargando = false;

  constructor(
    private reservasApi: ReservasApiService,
    private cdr: ChangeDetectorRef
  ) {}

  get fechaMinima(): string {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  soloLetras(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.reserva.nombre = input.value;
  }

  soloNumeros(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    this.reserva.telefono = input.value;
  }

  cargarReservasDelDia(): void {
    if (!this.reserva.fecha) {
      this.reservasDelDia = [];
      return;
    }

    this.reservasApi.getReservas(this.reserva.fecha).subscribe({
      next: (data) => {
        this.reservasDelDia = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar la disponibilidad.';
        this.cdr.detectChanges();
      },
    });
  }

  estaDisponible(hora: string): boolean {
    return !this.reservasDelDia.some(
      (r) => r.hora === hora && r.estado !== 'cancelado'
    );
  }

  onFechaChange(): void {
    this.mensaje = '';
    this.error = '';
    this.reserva.hora = '';
    this.cargarReservasDelDia();
  }

  validarFormulario(): boolean {
    const nombre = this.reserva.nombre.trim();
    const telefono = this.reserva.telefono.trim();

    if (!this.reserva.fecha || !this.reserva.hora || !nombre || !telefono) {
      this.error = 'Por favor, completá todos los campos.';
      return false;
    }

    if (this.reserva.fecha < this.fechaMinima) {
      this.error = 'No podés reservar una fecha anterior a hoy.';
      return false;
    }

    if (nombre.length < 3) {
      this.error = 'El nombre debe tener al menos 3 caracteres.';
      return false;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      this.error = 'El nombre solo puede contener letras.';
      return false;
    }

    if (telefono.length < 8) {
      this.error = 'Ingresá un teléfono válido.';
      return false;
    }

    return true;
  }

  reservar(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.validarFormulario()) return;

    this.cargando = true;
    this.cdr.detectChanges();

    this.reservasApi
      .crearReserva({
        fecha: this.reserva.fecha,
        hora: this.reserva.hora,
        nombre: this.reserva.nombre.trim(),
        telefono: this.reserva.telefono.trim(),
        estado: 'reservado',
      })
      .subscribe({
        next: () => {
          this.mensaje = `Turno reservado para ${this.reserva.nombre} el día ${this.reserva.fecha} a las ${this.reserva.hora}.`;

          this.reserva = {
            fecha: '',
            hora: '',
            nombre: '',
            telefono: '',
          };

          this.reservasDelDia = [];
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 409) {
            this.error =
              'Ese horario ya está reservado para la fecha seleccionada.';
          } else {
            this.error = 'Ocurrió un error al crear la reserva.';
          }

          this.cargando = false;
          this.cdr.detectChanges();
        },
      });
  }
}