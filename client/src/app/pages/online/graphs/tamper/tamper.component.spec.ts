import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TamperComponent } from './tamper.component';

describe('TamperComponent', () => {
  let component: TamperComponent;
  let fixture: ComponentFixture<TamperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TamperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
