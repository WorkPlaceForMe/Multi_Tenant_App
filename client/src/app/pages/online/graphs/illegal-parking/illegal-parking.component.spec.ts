import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllegalParkingComponent } from './illegal-parking.component';

describe('IllegalParkingComponent', () => {
  let component: IllegalParkingComponent;
  let fixture: ComponentFixture<IllegalParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllegalParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllegalParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
