import { TestBed, inject } from '@angular/core/testing';

import { CatchSingleService } from './catch-single.service';

describe('CatchSingleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatchSingleService]
    });
  });

  it('should be created', inject([CatchSingleService], (service: CatchSingleService) => {
    expect(service).toBeTruthy();
  }));
});
