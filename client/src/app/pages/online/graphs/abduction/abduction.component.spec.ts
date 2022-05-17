import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbductionComponent } from './abduction.component';

describe('AbductionComponent', () => {
  let component: AbductionComponent;
  let fixture: ComponentFixture<AbductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
