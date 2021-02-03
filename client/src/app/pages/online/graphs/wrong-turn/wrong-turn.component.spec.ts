import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongTurnComponent } from './wrong-turn.component';

describe('WrongTurnComponent', () => {
  let component: WrongTurnComponent;
  let fixture: ComponentFixture<WrongTurnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrongTurnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
