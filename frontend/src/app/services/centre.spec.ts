import { TestBed } from '@angular/core/testing';

import { Centre } from './centre';

describe('Centre', () => {
  let service: Centre;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Centre);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
