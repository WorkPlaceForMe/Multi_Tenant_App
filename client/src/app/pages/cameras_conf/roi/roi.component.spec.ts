import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ROIComponent } from './roi.component';

describe('ROIComponent', () => {
  let component: ROIComponent;
  let fixture: ComponentFixture<ROIComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ROIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ROIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
