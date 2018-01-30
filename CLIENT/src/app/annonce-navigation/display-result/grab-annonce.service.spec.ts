import { TestBed, inject } from '@angular/core/testing';

import { GrabAnnonceService } from './grab-annonce.service';

describe('GrabAnnonceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrabAnnonceService]
    });
  });

  it('should be created', inject([GrabAnnonceService], (service: GrabAnnonceService) => {
    expect(service).toBeTruthy();
  }));
});
