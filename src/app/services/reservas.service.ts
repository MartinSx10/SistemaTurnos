import { Injectable } from '@angular/core';

export interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  nombre: string;
  telefono: string;
  estado: 'reservado' | 'pagado' | 'cancelado';
}

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private readonly storageKey = 'reservas_futbol5';
  private reservas: Reserva[] = this.cargarDesdeStorage();

  private cargarDesdeStorage(): Reserva[] {
    const data = localStorage.getItem(this.storageKey);

    if (!data) return [];

    try {
      const reservas = JSON.parse(data) as Reserva[];

      return reservas.map((r) => ({
        ...r,
        id: r.id ?? crypto.randomUUID(),
      }));
    } catch {
      return [];
    }
  }

  private guardarEnStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.reservas));
  }

  private generarId(): string {
    return crypto.randomUUID();
  }

  getReservas(): Reserva[] {
    return this.reservas;
  }

  agregarReserva(
    reserva: Omit<Reserva, 'id'>
  ): boolean {
    const existe = this.reservas.some(
      (r) =>
        r.fecha === reserva.fecha &&
        r.hora === reserva.hora &&
        r.estado !== 'cancelado'
    );

    if (existe) {
      return false;
    }

    this.reservas.push({
      id: this.generarId(),
      ...reserva,
    });

    this.guardarEnStorage();
    return true;
  }

  eliminarReserva(id: string): void {
    this.reservas = this.reservas.filter((r) => r.id !== id);
    this.guardarEnStorage();
  }

  cambiarEstado(
    id: string,
    estado: 'reservado' | 'pagado' | 'cancelado'
  ): void {
    const reserva = this.reservas.find((r) => r.id === id);

    if (!reserva) return;

    reserva.estado = estado;
    this.guardarEnStorage();
  }

  horarioDisponible(fecha: string, hora: string): boolean {
    return !this.reservas.some(
      (r) => r.fecha === fecha && r.hora === hora && r.estado !== 'cancelado'
    );
  }

  limpiarReservas(): void {
    this.reservas = [];
    this.guardarEnStorage();
  }
  
}