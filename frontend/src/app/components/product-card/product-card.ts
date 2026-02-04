import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input() title!: string;
  @Input() price!: number;
  @Input() image!: string;
}
