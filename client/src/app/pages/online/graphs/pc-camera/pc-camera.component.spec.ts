import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcCameraComponent } from './pc-camera.component';

describe('PcCameraComponent', () => {
  let component: PcCameraComponent;
  let fixture: ComponentFixture<PcCameraComponent>;

  beforeEach(async(() => {
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
