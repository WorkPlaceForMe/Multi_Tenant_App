import { TestBed } from '@angular/core/testing';

import { TestDataAodService } from './test-data-aod.service';

describe('TestDataAodService', () => {
  let service: TestDataAodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestDataAodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
