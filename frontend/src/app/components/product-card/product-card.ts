import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
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
  @Input() stock: number | null = null;

  @Input() id!: string;
  discountedPrice: number = 0;
  isPromoActive: boolean = false;

  constructor(private cartService: CartService) {}

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

  onAddToCart() {
    const priceToSend = this.isPromoActive ? this.discountedPrice : this.price;
    this.cartService.addToCart(this.id, priceToSend);
  }
}
