import { TestBed } from '@angular/core/testing';

import { SiteStat } from './site-stat';

describe('SiteStat', () => {
  let service: SiteStat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteStat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
