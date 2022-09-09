import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurseSnatchingComponent } from './purse-snatching.component';

describe('PurseSnatchingComponent', () => {
  let component: PurseSnatchingComponent;
  let fixture: ComponentFixture<PurseSnatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurseSnatchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurseSnatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
