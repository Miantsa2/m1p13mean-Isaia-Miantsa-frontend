import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCardAdmin } from './store-card-admin';

describe('StoreCardAdmin', () => {
  let component: StoreCardAdmin;
  let fixture: ComponentFixture<StoreCardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCardAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
