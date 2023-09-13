import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteoDePersonalComponent } from './conteo-de-personal.component';

describe('ConteoDePersonalComponent', () => {
  let component: ConteoDePersonalComponent;
  let fixture: ComponentFixture<ConteoDePersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConteoDePersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConteoDePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
