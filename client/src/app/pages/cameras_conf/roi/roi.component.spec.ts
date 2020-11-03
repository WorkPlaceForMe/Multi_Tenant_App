import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ROIComponent } from './roi.component';

describe('ROIComponent', () => {
  let component: ROIComponent;
  let fixture: ComponentFixture<ROIComponent>;

  beforeEach(async(() => {
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
