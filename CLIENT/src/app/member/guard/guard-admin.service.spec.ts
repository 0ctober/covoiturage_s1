import { TestBed, inject } from '@angular/core/testing';

import { GuardAdminService } from './guard-admin.service';

describe('GuardAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardAdminService]
    });
  });

  it('should be created', inject([GuardAdminService], (service: GuardAdminService) => {
    expect(service).toBeTruthy();
  }));
});
