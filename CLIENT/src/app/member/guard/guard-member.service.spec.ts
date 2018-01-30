import { TestBed, inject } from '@angular/core/testing';

import { GuardMemberService } from './guard-member.service';

describe('GuardMemberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardMemberService]
    });
  });

  it('should be created', inject([GuardMemberService], (service: GuardMemberService) => {
    expect(service).toBeTruthy();
  }));
});
