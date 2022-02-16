import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokingComponent } from './smoking.component';

describe('SmokingComponent', () => {
  let component: SmokingComponent;
  let fixture: ComponentFixture<SmokingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmokingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmokingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
