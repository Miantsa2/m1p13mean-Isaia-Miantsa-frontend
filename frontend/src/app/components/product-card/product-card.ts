import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html',
})
export class ProductCard implements OnInit {
  @Input() title!: string;
  @Input() price!: number;
  @Input() image!: string;
  @Input() promotions: any = null;

  discountedPrice: number = 0;
  isPromoActive: boolean = false;

  ngOnInit() {
    this.checkPromotion();
  }

  checkPromotion() {
    if (this.promotions && this.promotions.pourcentage) {
      const now = new Date();
      const start = new Date(this.promotions.dateDebut);
      const end = new Date(this.promotions.dateFin);

      if (now >= start && now <= end) {
        this.isPromoActive = true;
        this.discountedPrice = this.price - (this.price * this.promotions.pourcentage / 100);
      }
    }
  }
}
