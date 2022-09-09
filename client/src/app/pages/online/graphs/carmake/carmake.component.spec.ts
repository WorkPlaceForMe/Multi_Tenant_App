import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CarmakeComponent } from './carmake.component';

describe('CarmakeComponent', () => {
  let component: CarmakeComponent;
  let fixture: ComponentFixture<CarmakeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CarmakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarmakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
