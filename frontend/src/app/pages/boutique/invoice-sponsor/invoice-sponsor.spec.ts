import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSponsor } from './invoice-sponsor';

describe('InvoiceSponsor', () => {
  let component: InvoiceSponsor;
  let fixture: ComponentFixture<InvoiceSponsor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceSponsor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceSponsor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
