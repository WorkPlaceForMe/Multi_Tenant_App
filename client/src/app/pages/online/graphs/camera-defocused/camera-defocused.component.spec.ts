import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDefocusedComponent } from './camera-defocused.component';

describe('CameraDefocusedComponent', () => {
  let component: CameraDefocusedComponent;
  let fixture: ComponentFixture<CameraDefocusedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraDefocusedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraDefocusedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
