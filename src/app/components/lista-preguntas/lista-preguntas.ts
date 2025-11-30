import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService, Pregunta } from '../../services/ia';

@Component({
  selector: 'app-lista-preguntas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-preguntas.html',
  styleUrl: './lista-preguntas.css',
})
export class ListaPreguntas implements OnInit {
  preguntas: Pregunta[] = [];
  preguntasFiltradas: Pregunta[] = [];
  nuevaPregunta: Pregunta = { titulo: '', contenido: '' };
  palabraBusqueda = '';
  cargando = false;
  error = '';
  modoCrear = false;

  constructor(private readonly iaService: IaService) {}

  ngOnInit(): void {
    this.cargarPreguntas();
  }

  cargarPreguntas(): void {
    this.cargando = true;
    this.error = '';

    this.iaService.obtenerPreguntas().subscribe({
      next: (preguntas) => {
        this.preguntas = preguntas;
        this.preguntasFiltradas = preguntas;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar preguntas';
        console.error(err);
        this.cargando = false;
      },
    });
  }

  onBusquedaChange(): void {
    if (!this.palabraBusqueda.trim()) {
      this.preguntasFiltradas = this.preguntas;
      return;
    }

    this.iaService.buscarPreguntas(this.palabraBusqueda).subscribe({
      next: (preguntas) => {
        this.preguntasFiltradas = preguntas;
      },
      error: (err) => {
        console.error('Error al buscar:', err);
        // Búsqueda local como fallback
        const keyword = this.palabraBusqueda.toLowerCase();
        this.preguntasFiltradas = this.preguntas.filter(
          (p) =>
            p.titulo.toLowerCase().includes(keyword) || p.contenido.toLowerCase().includes(keyword)
        );
      },
    });
  }

  crearPregunta(): void {
    if (!this.nuevaPregunta.titulo.trim() || !this.nuevaPregunta.contenido.trim()) {
      this.error = 'Título y contenido son requeridos';
      return;
    }

    this.cargando = true;
    this.iaService.crearPregunta(this.nuevaPregunta).subscribe({
      next: (pregunta) => {
        this.preguntas.unshift(pregunta);
        this.preguntasFiltradas = this.preguntas;
        this.nuevaPregunta = { titulo: '', contenido: '' };
        this.modoCrear = false;
        this.cargando = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Error al crear pregunta';
        console.error(err);
        this.cargando = false;
      },
    });
  }

  toggleModoCrear(): void {
    this.modoCrear = !this.modoCrear;
    this.error = '';
  }

  cancelarCreacion(): void {
    this.modoCrear = false;
    this.nuevaPregunta = { titulo: '', contenido: '' };
    this.error = '';
  }
}
