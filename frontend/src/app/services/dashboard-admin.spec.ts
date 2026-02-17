import { TestBed } from '@angular/core/testing';

import { DashboardAdmin } from './dashboard-admin';

describe('DashboardAdmin', () => {
  let service: DashboardAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
