import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiempoDeProcesamientoComponent } from './tiempo-de-procesamiento.component';

describe('TiempoDeProcesamientoComponent', () => {
  let component: TiempoDeProcesamientoComponent;
  let fixture: ComponentFixture<TiempoDeProcesamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiempoDeProcesamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiempoDeProcesamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
