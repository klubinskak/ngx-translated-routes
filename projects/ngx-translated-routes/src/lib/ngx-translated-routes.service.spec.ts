import { TestBed } from '@angular/core/testing';

import { NgxTranslatedRoutesService } from './ngx-translated-routes.service';

describe('NgxTranslatedRoutesService', () => {
  let service: NgxTranslatedRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTranslatedRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
