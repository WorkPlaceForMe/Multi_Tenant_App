import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnesProcesadasComponent } from './carnes-procesadas.component';

describe('CarnesProcesadasComponent', () => {
  let component: CarnesProcesadasComponent;
  let fixture: ComponentFixture<CarnesProcesadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarnesProcesadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarnesProcesadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
