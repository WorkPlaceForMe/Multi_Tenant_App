import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowOpenerComponent } from './window-opener.component';

describe('WindowOpenerComponent', () => {
  let component: WindowOpenerComponent;
  let fixture: ComponentFixture<WindowOpenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowOpenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
