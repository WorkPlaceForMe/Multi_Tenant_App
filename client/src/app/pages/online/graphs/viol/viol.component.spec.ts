import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolComponent } from './viol.component';

describe('ViolComponent', () => {
  let component: ViolComponent;
  let fixture: ComponentFixture<ViolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
