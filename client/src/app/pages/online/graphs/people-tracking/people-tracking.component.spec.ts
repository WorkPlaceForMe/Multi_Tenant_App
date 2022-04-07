import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleTrackingComponent } from './people-tracking.component';

describe('PeopleTrackingComponent', () => {
  let component: PeopleTrackingComponent;
  let fixture: ComponentFixture<PeopleTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
