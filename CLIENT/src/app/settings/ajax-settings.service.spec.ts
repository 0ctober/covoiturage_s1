import { TestBed, inject } from '@angular/core/testing';

import { AjaxSettingsService } from './ajax-settings.service';

describe('AjaxSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AjaxSettingsService]
    });
  });

  it('should be created', inject([AjaxSettingsService], (service: AjaxSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
