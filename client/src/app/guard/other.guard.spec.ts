import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { OtherGuard } from './other.guard';

describe('OtherGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OtherGuard]
    });
  });

  it('should ...', inject([OtherGuard], (guard: OtherGuard) => {
    expect(guard).toBeTruthy();
  }));
});
