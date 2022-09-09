import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CenterComponent } from './center.component';

describe('CenterComponent', () => {
  let component: CenterComponent;
  let fixture: ComponentFixture<CenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
