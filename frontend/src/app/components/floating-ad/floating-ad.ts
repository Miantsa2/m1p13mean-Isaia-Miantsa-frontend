import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '../../services/produit';


@Component({
  selector: 'app-floating-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-ad.html',
})
export class FloatingAd implements OnInit, OnDestroy{

  constructor(private produitService: Produit) {}
 
  adsList: any[] = [];

  loadSponsorisedProduits() {
    this.produitService.getSponsorisedProduits().subscribe({
      next: (data) => {
        this.adsList = data.map((p: any) => ({
          id: p._id,
          produit: p.nom,
          boutique: p.boutique?.nom,
          link: `/store/${p.boutique?._id}`
        }));
      },
      error: (err) => {
        console.error('Erreur sponsor:', err);
      }
    });
  }
  currentIndex = signal(0);
  isVisible = signal(true);
  private timer: any;

  ngOnInit() {
    this.loadSponsorisedProduits();
    this.timer = setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.adsList.length);
    }, 15000);

  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
