import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PcCameraComponent } from './pc-camera.component';

describe('PcCameraComponent', () => {
  let component: PcCameraComponent;
  let fixture: ComponentFixture<PcCameraComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PcCameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
