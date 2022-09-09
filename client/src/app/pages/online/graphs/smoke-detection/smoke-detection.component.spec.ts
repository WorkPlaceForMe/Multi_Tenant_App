import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokeDetectionComponent } from './smoke-detection.component';

describe('SmokeDetectionComponent', () => {
  let component: SmokeDetectionComponent;
  let fixture: ComponentFixture<SmokeDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmokeDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmokeDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
