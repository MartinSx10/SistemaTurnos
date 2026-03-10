import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.scss',
})
export class Reservas {
  horarios: string[] = [
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  reserva = {
    fecha: '',
    hora: '',
    nombre: '',
    telefono: '',
  };

  mensaje = '';
  error = '';

  constructor(private reservasService: ReservasService) {}

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

  estaDisponible(hora: string): boolean {
    if (!this.reserva.fecha) return true;
    return this.reservasService.horarioDisponible(this.reserva.fecha, hora);
  }

  onFechaChange() {
    this.mensaje = '';
    this.error = '';

    if (this.reserva.hora && !this.estaDisponible(this.reserva.hora)) {
      this.reserva.hora = '';
    }
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

  reservar() {
  this.mensaje = '';
  this.error = '';

  if (!this.validarFormulario()) {
    return;
  }

  const ok = this.reservasService.agregarReserva({
    fecha: this.reserva.fecha,
    hora: this.reserva.hora,
    nombre: this.reserva.nombre.trim(),
    telefono: this.reserva.telefono.trim(),
    estado: 'reservado',
  });

  if (!ok) {
    this.error = 'Ese horario ya está reservado para la fecha seleccionada.';
    return;
  }

  this.mensaje = `Turno reservado para ${this.reserva.nombre} el día ${this.reserva.fecha} a las ${this.reserva.hora}.`;

  this.reserva = {
    fecha: '',
    hora: '',
    nombre: '',
    telefono: '',
  };
}
}