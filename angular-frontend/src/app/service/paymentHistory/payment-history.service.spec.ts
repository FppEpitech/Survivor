import { TestBed } from '@angular/core/testing';

import { PaymentHistoryService } from './payment-history.service';

describe('PaymentHistoryService', () => {
  let service: PaymentHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
