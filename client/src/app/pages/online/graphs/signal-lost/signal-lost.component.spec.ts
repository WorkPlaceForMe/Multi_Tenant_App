import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalLostComponent } from './signal-lost.component';

describe('SignalLostComponent', () => {
  let component: SignalLostComponent;
  let fixture: ComponentFixture<SignalLostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignalLostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
