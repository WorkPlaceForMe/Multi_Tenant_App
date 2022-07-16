import { TestBed } from '@angular/core/testing';

import { TestingDataService } from './testing-data.service';

describe('TestingDataService', () => {
  let service: TestingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
