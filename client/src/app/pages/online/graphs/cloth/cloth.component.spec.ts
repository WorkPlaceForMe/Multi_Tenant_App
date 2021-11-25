import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClothComponent } from './cloth.component';

describe('ClothComponent', () => {
  let component: ClothComponent;
  let fixture: ComponentFixture<ClothComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClothComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
