import { TestBed, inject } from '@angular/core/testing';

import { VillesService } from './villes.service';

describe('VillesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VillesService]
    });
  });

  it('should be created', inject([VillesService], (service: VillesService) => {
    expect(service).toBeTruthy();
  }));
});
