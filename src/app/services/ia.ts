import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Pregunta {
  id?: number;
  titulo: string;
  contenido: string;
}

@Injectable({
  providedIn: 'root',
})
export class IaService {
  private readonly baseUrl = 'http://localhost:8080/api'; // Cambia a 8081 si es necesario

  constructor(private readonly http: HttpClient) {}

  // Enviar pregunta a la IA
  enviarPregunta(pregunta: string): Observable<string> {
    return this.http
      .post(`${this.baseUrl}/ia/preguntar`, { texto: pregunta }, { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  // Obtener todas las preguntas
  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http
      .get<Pregunta[]>(`${this.baseUrl}/preguntas`)
      .pipe(catchError(this.handleError));
  }

  // Buscar preguntas
  buscarPreguntas(keyword: string): Observable<Pregunta[]> {
    return this.http
      .get<Pregunta[]>(`${this.baseUrl}/preguntas/search?keyword=${encodeURIComponent(keyword)}`)
      .pipe(catchError(this.handleError));
  }

  // Crear nueva pregunta
  crearPregunta(pregunta: Pregunta): Observable<Pregunta> {
    return this.http
      .post<Pregunta>(`${this.baseUrl}/preguntas`, pregunta)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ Error en servicio IA:', error);

    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}