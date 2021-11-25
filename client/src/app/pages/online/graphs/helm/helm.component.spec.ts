import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelmComponent } from './helm.component';

describe('HelmComponent', () => {
  let component: HelmComponent;
  let fixture: ComponentFixture<HelmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
