import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceListComponent } from './face-list.component';

describe('FaceListComponent', () => {
  let component: FaceListComponent;
  let fixture: ComponentFixture<FaceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
