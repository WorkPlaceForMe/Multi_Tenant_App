import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranspassingComponent } from './transpassing.component';

describe('TranspassingComponent', () => {
  let component: TranspassingComponent;
  let fixture: ComponentFixture<TranspassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranspassingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranspassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
