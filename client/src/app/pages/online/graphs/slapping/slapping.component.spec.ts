import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlappingComponent } from './slapping.component';

describe('SlappingComponent', () => {
  let component: SlappingComponent;
  let fixture: ComponentFixture<SlappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
