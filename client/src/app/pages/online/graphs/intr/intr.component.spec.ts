import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntrComponent } from './intr.component';

describe('IntrComponent', () => {
  let component: IntrComponent;
  let fixture: ComponentFixture<IntrComponent>;

  beforeEach(async(() => {
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
