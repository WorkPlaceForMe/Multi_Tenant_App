import { TestBed } from '@angular/core/testing';

import { TestDataIntrudeService } from './test-data-intrude.service';

describe('TestDataIntrudeService', () => {
  let service: TestDataIntrudeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestDataIntrudeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
