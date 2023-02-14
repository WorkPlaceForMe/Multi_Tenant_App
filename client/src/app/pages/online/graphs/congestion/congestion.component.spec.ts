import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongestionComponent } from './congestion.component';

describe('CongestionComponent', () => {
  let component: CongestionComponent;
  let fixture: ComponentFixture<CongestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CongestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CongestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
