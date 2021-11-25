import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CFaceComponent } from './c-face.component';

describe('CFaceComponent', () => {
  let component: CFaceComponent;
  let fixture: ComponentFixture<CFaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CFaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
