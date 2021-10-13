import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnprComponent } from './anpr.component';

describe('AnprComponent', () => {
  let component: AnprComponent;
  let fixture: ComponentFixture<AnprComponent>;

  beforeEach(waitForAsync(() => {
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
