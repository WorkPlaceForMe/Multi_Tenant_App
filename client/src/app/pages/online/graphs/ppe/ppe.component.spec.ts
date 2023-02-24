import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpeComponent } from './ppe.component';

describe('PpeComponent', () => {
  let component: PpeComponent;
  let fixture: ComponentFixture<PpeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PpeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
