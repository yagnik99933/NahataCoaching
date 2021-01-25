import { TestBed } from '@angular/core/testing';

import { FirebaseauthService } from './firebaseauth.service';

describe('FirebaseauthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseauthService = TestBed.get(FirebaseauthService);
    expect(service).toBeTruthy();
  });
});
