import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService } from '../../services/ia';
import { Subject, takeUntil } from 'rxjs';

interface Mensaje {
  texto: string;
  esUsuario: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-ia.html',
  styleUrls: ['./chat-ia.css'], // ← AQUÍ ESTABA EL ERROR
})
export class ChatIa implements OnDestroy {
  mensajes: Mensaje[] = [];
  nuevaPregunta = '';
  cargando = false;
  ultimoError = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly iaService: IaService, private readonly cdRef: ChangeDetectorRef) {}

  enviarPregunta(): void {
    if (!this.nuevaPregunta.trim() || this.cargando) {
      return;
    }

    const preguntaTexto = this.nuevaPregunta.trim();
    console.log('🔵 Enviando pregunta:', preguntaTexto);

    // Usar approach inmutable
    this.mensajes = [
      ...this.mensajes,
      {
        texto: preguntaTexto,
        esUsuario: true,
        timestamp: new Date(),
      },
    ];

    this.nuevaPregunta = '';
    this.cargando = true;
    this.ultimoError = '';

    // Enviar pregunta a la IA con unsubscribe automático
    this.iaService
      .enviarPregunta(preguntaTexto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {
          this.mensajes = [
            ...this.mensajes,
            {
              texto: respuesta,
              esUsuario: false,
              timestamp: new Date(),
            },
          ];
          this.cargando = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error:', error);
          this.mensajes = [
            ...this.mensajes,
            {
              texto: `Error: ${error.message || 'No se pudo conectar al servidor'}`,
              esUsuario: false,
              timestamp: new Date(),
            },
          ];
          this.cargando = false;
          this.ultimoError = error.message;
          this.cdRef.detectChanges();
        },
      });
  }

  limpiarChat(): void {
    this.mensajes = [];
    this.ultimoError = '';
  }

  probarConexion(): void {
    this.iaService
      .obtenerPreguntas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (preguntas) => {
          this.mensajes = [
            ...this.mensajes,
            {
              texto: `✅ Conexión exitosa. Preguntas: ${preguntas.length}`,
              esUsuario: false,
            },
          ];
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.mensajes = [
            ...this.mensajes,
            {
              texto: `❌ Error de conexión: ${error.message}`,
              esUsuario: false,
            },
          ];
          this.cdRef.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
