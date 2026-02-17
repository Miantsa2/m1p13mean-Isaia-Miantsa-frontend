import { TestBed } from '@angular/core/testing';

import { BoutiqueStatService } from './boutique-stat-service';

describe('BoutiqueStatService', () => {
  let service: BoutiqueStatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoutiqueStatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
