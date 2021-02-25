import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetngsComponent } from './setngs.component';

describe('SetngsComponent', () => {
  let component: SetngsComponent;
  let fixture: ComponentFixture<SetngsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetngsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetngsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
