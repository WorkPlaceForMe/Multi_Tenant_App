import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnprComponent } from './anpr.component';

describe('AnprComponent', () => {
  let component: AnprComponent;
  let fixture: ComponentFixture<AnprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
