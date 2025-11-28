import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService } from '../../services/ia.service';

@Component({
  selector: 'app-chat-la',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-la.html',
  styleUrls: ['./chat-la.css']
})
export class ChatLaComponent {
  mensajes: any[] = [];
  nuevaPregunta: string = '';
  cargando: boolean = false;

  constructor(private iaService: IaService) {}

  enviarPregunta() {
    if (!this.nuevaPregunta.trim() || this.cargando) return;

    const pregunta = this.nuevaPregunta;
    this.mensajes.push({ texto: pregunta, esUsuario: true });
    this.nuevaPregunta = '';
    this.cargando = true;

    this.iaService.enviarPregunta(pregunta).subscribe({
      next: (respuesta) => {
        this.mensajes.push({ texto: respuesta, esUsuario: false });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.mensajes.push({ 
          texto: '❌ Error al conectar con el servidor. Asegúrate que el backend esté ejecutándose en puerto 8080.', 
          esUsuario: false 
        });
        this.cargando = false;
      }
    });
  }
}