import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisrobingComponent } from './disrobing.component';

describe('DisrobingComponent', () => {
  let component: DisrobingComponent;
  let fixture: ComponentFixture<DisrobingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisrobingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisrobingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
