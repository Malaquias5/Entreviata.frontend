import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pregunta {
  id?: number;
  titulo: string;
  contenido: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  // Enviar pregunta a la IA
  enviarPregunta(pregunta: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/ia/preguntar`, 
      { texto: pregunta }, 
      { responseType: 'text' }
    );
  }

  // Obtener todas las preguntas
  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.baseUrl}/preguntas`);
  }

  // Buscar preguntas
  buscarPreguntas(keyword: string): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(`${this.baseUrl}/preguntas/search?keyword=${keyword}`);
  }

  // Crear nueva pregunta
  crearPregunta(pregunta: Pregunta): Observable<Pregunta> {
    return this.http.post<Pregunta>(`${this.baseUrl}/preguntas`, pregunta);
  }
}