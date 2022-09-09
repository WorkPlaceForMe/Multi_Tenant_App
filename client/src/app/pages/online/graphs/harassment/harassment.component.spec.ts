import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarassmentComponent } from './harassment.component';

describe('HarassmentComponent', () => {
  let component: HarassmentComponent;
  let fixture: ComponentFixture<HarassmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarassmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarassmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
