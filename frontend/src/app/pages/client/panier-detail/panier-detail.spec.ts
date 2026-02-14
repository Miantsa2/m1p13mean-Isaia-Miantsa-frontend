import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierDetail } from './panier-detail';

describe('PanierDetail', () => {
  let component: PanierDetail;
  let fixture: ComponentFixture<PanierDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
