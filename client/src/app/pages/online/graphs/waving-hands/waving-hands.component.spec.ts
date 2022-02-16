import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WavingHandsComponent } from './waving-hands.component';

describe('WavingHandsComponent', () => {
  let component: WavingHandsComponent;
  let fixture: ComponentFixture<WavingHandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WavingHandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WavingHandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
