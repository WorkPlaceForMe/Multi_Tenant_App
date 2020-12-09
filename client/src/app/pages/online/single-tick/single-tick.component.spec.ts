import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTickComponent } from './single-tick.component';

describe('SingleTickComponent', () => {
  let component: SingleTickComponent;
  let fixture: ComponentFixture<SingleTickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
