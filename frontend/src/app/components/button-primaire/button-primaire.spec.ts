import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPrimaire } from './button-primaire';

describe('ButtonPrimaire', () => {
  let component: ButtonPrimaire;
  let fixture: ComponentFixture<ButtonPrimaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPrimaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPrimaire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
