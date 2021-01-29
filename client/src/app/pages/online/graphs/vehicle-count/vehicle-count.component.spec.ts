import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCountComponent } from './vehicle-count.component';

describe('VehicleCountComponent', () => {
  let component: VehicleCountComponent;
  let fixture: ComponentFixture<VehicleCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
