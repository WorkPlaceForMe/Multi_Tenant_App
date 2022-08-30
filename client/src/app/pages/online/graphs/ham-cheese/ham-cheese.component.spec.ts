import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamCheeseComponent } from './ham-cheese.component';

describe('HamCheeseComponent', () => {
  let component: HamCheeseComponent;
  let fixture: ComponentFixture<HamCheeseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HamCheeseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HamCheeseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
