import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api';
import { AuthService } from './auth.service';

export interface Reserva {
  id: number;
  fecha: string;
  hora: string;
  nombre: string;
  telefono: string;
  estado: 'reservado' | 'pagado' | 'cancelado';
}

export interface CrearReservaDto {
  fecha: string;
  hora: string;
  nombre: string;
  telefono: string;
  estado: 'reservado' | 'pagado' | 'cancelado';
}

@Injectable({
  providedIn: 'root',
})
export class ReservasApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = `${API_URL}/reservas`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getReservas(fecha?: string): Observable<Reserva[]> {
    let params = new HttpParams();

    if (fecha) {
      params = params.set('fecha', fecha);
    }

    return this.http.get<Reserva[]>(this.baseUrl, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  crearReserva(data: CrearReservaDto): Observable<Reserva> {
    return this.http.post<Reserva>(this.baseUrl, data);
  }

  cambiarEstado(
    id: number,
    estado: 'reservado' | 'pagado' | 'cancelado'
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/${id}/estado`,
      { estado },
      { headers: this.getAuthHeaders() }
    );
  }

  getDisponibilidad(fecha: string): Observable<Reserva[]> {
  const params = new HttpParams().set('fecha', fecha);

  return this.http.get<Reserva[]>(`${this.baseUrl}/disponibilidad`, { params });
}

  eliminarReserva(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}