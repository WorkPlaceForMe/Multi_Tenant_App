import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoExitComponent } from './no-exit.component';

describe('NoExitComponent', () => {
  let component: NoExitComponent;
  let fixture: ComponentFixture<NoExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoExitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
