import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDefectComponent } from './module-defect.component';

describe('ModuleDefectComponent', () => {
  let component: ModuleDefectComponent;
  let fixture: ComponentFixture<ModuleDefectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleDefectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDefectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
