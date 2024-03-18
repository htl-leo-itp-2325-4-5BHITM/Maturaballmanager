import { TestBed } from '@angular/core/testing';

import { PartnerCompanyService } from './partner-company.service';

describe('PartnerCompanyService', () => {
  let service: PartnerCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
