import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraBlindedComponent } from './camera-blinded.component';

describe('CameraBlindedComponent', () => {
  let component: CameraBlindedComponent;
  let fixture: ComponentFixture<CameraBlindedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraBlindedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraBlindedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
