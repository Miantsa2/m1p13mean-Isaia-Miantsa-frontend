import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCorps } from './table-corps';

describe('TableCorps', () => {
  let component: TableCorps;
  let fixture: ComponentFixture<TableCorps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCorps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCorps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
