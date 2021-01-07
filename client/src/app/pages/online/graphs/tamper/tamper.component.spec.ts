import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamperComponent } from './tamper.component';

describe('TamperComponent', () => {
  let component: TamperComponent;
  let fixture: ComponentFixture<TamperComponent>;

  beforeEach(async(() => {
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
