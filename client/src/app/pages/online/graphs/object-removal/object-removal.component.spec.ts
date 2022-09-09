import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRemovalComponent } from './object-removal.component';

describe('ObjectRemovalComponent', () => {
  let component: ObjectRemovalComponent;
  let fixture: ComponentFixture<ObjectRemovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectRemovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
