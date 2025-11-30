import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatIa } from './components/chat-ia/chat-ia';
import { ListaPreguntas } from './components/lista-preguntas/lista-preguntas';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatIa, ListaPreguntas],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'entrevista-ui';
}
