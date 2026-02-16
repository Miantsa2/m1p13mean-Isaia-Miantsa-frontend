import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-ad.html',
})
export class FloatingAd implements OnInit, OnDestroy{
  //Remplacer par les données réelles
  adsList = [
    { id: 1, produit: 'Sandwich Spécial', boutique: 'Snack Fast', link: '/produit/1' },
    { id: 2, produit: 'T-shirt Summer', boutique: 'Fashion Store', link: '/produit/2' },
    { id: 3, produit: 'Jus Naturel', boutique: 'Healthy Bar', link: '/produit/3' }
  ];
 
  currentIndex = signal(0);
  isVisible = signal(true);
  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.adsList.length);
    }, 15000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
