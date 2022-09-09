import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterExitVComponent } from './enter-exit-v.component';

describe('EnterExitVComponent', () => {
  let component: EnterExitVComponent;
  let fixture: ComponentFixture<EnterExitVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterExitVComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterExitVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
