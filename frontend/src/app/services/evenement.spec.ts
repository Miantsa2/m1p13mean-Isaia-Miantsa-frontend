import { TestBed } from '@angular/core/testing';

import { Event } from './evenement';

describe('Event', () => {
  let service: Event;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Event);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
