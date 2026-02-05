import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-store-card',
  imports: [],
  standalone: true,
  templateUrl: './store-card.html',
})
export class StoreCard {
  @Input() image = '';
  @Input() description = '';
}