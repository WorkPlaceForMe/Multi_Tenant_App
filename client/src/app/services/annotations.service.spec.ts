import { TestBed } from '@angular/core/testing';

import { AnnotationsService } from './annotations.service';

describe('AnnotationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnnotationsService = TestBed.get(AnnotationsService);
    expect(service).toBeTruthy();
  });
});
