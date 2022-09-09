import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneChangeComponent } from './scene-change.component';

describe('SceneChangeComponent', () => {
  let component: SceneChangeComponent;
  let fixture: ComponentFixture<SceneChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
