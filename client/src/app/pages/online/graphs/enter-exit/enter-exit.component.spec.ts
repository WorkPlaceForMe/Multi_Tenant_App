import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterExitComponent } from './enter-exit.component';

describe('EnterExitComponent', () => {
  let component: EnterExitComponent;
  let fixture: ComponentFixture<EnterExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterExitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
