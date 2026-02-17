import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livraison } from './livraison';

describe('Livraison', () => {
  let component: Livraison;
  let fixture: ComponentFixture<Livraison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livraison]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Livraison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
