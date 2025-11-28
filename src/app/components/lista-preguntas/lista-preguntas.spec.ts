import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreguntas } from './lista-preguntas';

describe('ListaPreguntas', () => {
  let component: ListaPreguntas;
  let fixture: ComponentFixture<ListaPreguntas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPreguntas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPreguntas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
