import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxleComponent } from './axle.component';

describe('AxleComponent', () => {
  let component: AxleComponent;
  let fixture: ComponentFixture<AxleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AxleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AxleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
