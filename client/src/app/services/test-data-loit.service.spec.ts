import { TestBed } from '@angular/core/testing';

import { TestDataLoitService } from './test-data-loit.service';

describe('TestDataLoitService', () => {
  let service: TestDataLoitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestDataLoitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
