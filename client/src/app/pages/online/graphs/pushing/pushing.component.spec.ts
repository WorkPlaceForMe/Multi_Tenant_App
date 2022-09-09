import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushingComponent } from './pushing.component';

describe('PushingComponent', () => {
  let component: PushingComponent;
  let fixture: ComponentFixture<PushingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
