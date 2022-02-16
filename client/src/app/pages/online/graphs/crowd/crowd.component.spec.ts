import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrowdComponent } from './crowd.component';

describe('CrowdComponent', () => {
  let component: CrowdComponent;
  let fixture: ComponentFixture<CrowdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrowdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrowdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
