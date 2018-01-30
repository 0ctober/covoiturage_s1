import { TestBed, inject } from '@angular/core/testing';

import { AlreadyLoggedService } from './already-logged.service';

describe('AlreadyLoggedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlreadyLoggedService]
    });
  });

  it('should be created', inject([AlreadyLoggedService], (service: AlreadyLoggedService) => {
    expect(service).toBeTruthy();
  }));
});
