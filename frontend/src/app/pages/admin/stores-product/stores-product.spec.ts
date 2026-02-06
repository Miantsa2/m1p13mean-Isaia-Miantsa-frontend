import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresProduct } from './stores-product';

describe('StoresProduct', () => {
  let component: StoresProduct;
  let fixture: ComponentFixture<StoresProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoresProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoresProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
