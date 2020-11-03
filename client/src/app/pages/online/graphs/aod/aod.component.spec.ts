import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AodComponent } from './aod.component';

describe('AodComponent', () => {
  let component: AodComponent;
  let fixture: ComponentFixture<AodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
