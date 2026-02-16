import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingAd } from './floating-ad';

describe('FloatingAd', () => {
  let component: FloatingAd;
  let fixture: ComponentFixture<FloatingAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingAd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
