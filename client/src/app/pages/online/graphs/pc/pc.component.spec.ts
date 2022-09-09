import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PcComponent } from './pc.component';

describe('PcComponent', () => {
  let component: PcComponent;
  let fixture: ComponentFixture<PcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
