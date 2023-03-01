import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehLoitComponent } from './veh-loit.component';

describe('VehLoitComponent', () => {
  let component: VehLoitComponent;
  let fixture: ComponentFixture<VehLoitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehLoitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehLoitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
