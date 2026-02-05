import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDivider } from './section-divider';

describe('SectionDivider', () => {
  let component: SectionDivider;
  let fixture: ComponentFixture<SectionDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionDivider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionDivider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
