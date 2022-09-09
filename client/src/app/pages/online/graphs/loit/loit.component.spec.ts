import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoitComponent } from './loit.component';

describe('LoitComponent', () => {
  let component: LoitComponent;
  let fixture: ComponentFixture<LoitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
