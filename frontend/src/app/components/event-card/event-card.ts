import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [],
  templateUrl: './event-card.html',
})
export class EventCard {
  @Input() icon = '';
  @Input() title = '';
  @Input() text = '';
}
