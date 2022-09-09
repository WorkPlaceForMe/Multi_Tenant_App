import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IntrComponent } from './intr.component';

describe('IntrComponent', () => {
  let component: IntrComponent;
  let fixture: ComponentFixture<IntrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IntrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
