import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Charge } from './charge';

describe('Charge', () => {
  let component: Charge;
  let fixture: ComponentFixture<Charge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Charge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Charge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
