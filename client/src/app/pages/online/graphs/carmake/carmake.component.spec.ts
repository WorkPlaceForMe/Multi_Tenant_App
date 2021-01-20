import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarmakeComponent } from './carmake.component';

describe('CarmakeComponent', () => {
  let component: CarmakeComponent;
  let fixture: ComponentFixture<CarmakeComponent>;

  beforeEach(async(() => {
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
