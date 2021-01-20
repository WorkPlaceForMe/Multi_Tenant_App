import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsOnRoadComponent } from './animals-on-road.component';

describe('AnimalsOnRoadComponent', () => {
  let component: AnimalsOnRoadComponent;
  let fixture: ComponentFixture<AnimalsOnRoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalsOnRoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalsOnRoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
