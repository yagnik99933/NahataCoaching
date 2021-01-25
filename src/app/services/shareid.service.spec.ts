import { TestBed } from '@angular/core/testing';

import { ShareidService } from './shareid.service';

describe('ShareidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareidService = TestBed.get(ShareidService);
    expect(service).toBeTruthy();
  });
});
