import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-about-card',
  imports: [],
  standalone: true,
  templateUrl: './about-card.html',
})
export class AboutCard {
  @Input() icon = '';
  @Input() description = '';
}
