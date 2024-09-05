import { TestBed } from '@angular/core/testing';

import { CompatibilityService } from './compatibility.service';

describe('CompatibilityService', () => {
  let service: CompatibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompatibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
