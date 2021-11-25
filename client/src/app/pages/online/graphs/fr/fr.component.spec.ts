import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FrComponent } from './fr.component';

describe('FrComponent', () => {
  let component: FrComponent;
  let fixture: ComponentFixture<FrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
