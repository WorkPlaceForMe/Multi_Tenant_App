import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedingComponent } from './speeding.component';

describe('SpeedingComponent', () => {
  let component: SpeedingComponent;
  let fixture: ComponentFixture<SpeedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
