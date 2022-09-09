import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VidComponent } from './vid.component';

describe('VidComponent', () => {
  let component: VidComponent;
  let fixture: ComponentFixture<VidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
