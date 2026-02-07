import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStore } from './event-store';

describe('EventStore', () => {
  let component: EventStore;
  let fixture: ComponentFixture<EventStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventStore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
