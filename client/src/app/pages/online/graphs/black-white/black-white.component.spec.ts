import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackWhiteComponent } from './black-white.component';

describe('BlackWhiteComponent', () => {
  let component: BlackWhiteComponent;
  let fixture: ComponentFixture<BlackWhiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackWhiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
