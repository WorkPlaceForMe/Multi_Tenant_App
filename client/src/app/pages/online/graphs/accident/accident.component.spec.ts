import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccidentComponent } from './accident.component';

describe('AccidentComponent', () => {
  let component: AccidentComponent;
  let fixture: ComponentFixture<AccidentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
