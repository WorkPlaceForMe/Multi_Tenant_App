import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AxleComponent } from './axle.component';

describe('AxleComponent', () => {
  let component: AxleComponent;
  let fixture: ComponentFixture<AxleComponent>;

  beforeEach(waitForAsync(() => {
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
