import { TestBed } from '@angular/core/testing';

import { ClothesService } from './clothes.service';

describe('ClothesService', () => {
  let service: ClothesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
