import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VehicleCountComponent } from './vehicle-count.component';

describe('VehicleCountComponent', () => {
  let component: VehicleCountComponent;
  let fixture: ComponentFixture<VehicleCountComponent>;

  beforeEach(waitForAsync(() => {
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
