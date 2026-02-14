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
  @Input() dateStart: string | null = null;
  @Input() dateEnd: string | null = null;
  @Input() owner ='';


  formatDate(date: string | Date | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }

}
