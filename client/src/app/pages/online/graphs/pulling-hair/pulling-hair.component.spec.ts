import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullingHairComponent } from './pulling-hair.component';

describe('PullingHairComponent', () => {
  let component: PullingHairComponent;
  let fixture: ComponentFixture<PullingHairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullingHairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullingHairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
