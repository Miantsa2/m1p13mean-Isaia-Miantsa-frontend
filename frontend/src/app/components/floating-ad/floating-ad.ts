import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '../../services/produit';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-floating-ad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-ad.html',
})
export class FloatingAd implements OnInit, OnDestroy{
  readonly apiUrl = environment.apiUrl;
  constructor(private produitService: Produit) {}
 
  adsList: any[] = [];

  loadSponsorisedProduits() {
    this.produitService.getSponsorisedProduits().subscribe({
      next: (data) => {
        this.adsList = data.map((p: any) => ({
          id: p._id,
          produit: p.nom,
          boutique: p.boutique?.nom,
          image: p.description,
          link: `/store/${p.boutique?._id}`
        }));
      },
      error: (err) => {
        console.error('Erreur sponsor:', err);
      }
    });
  }

  getProductImage(imagePath: string): string {
    if (!imagePath) return '/image.png';
    if (imagePath.startsWith('/uploads')) {
      return `${this.apiUrl}${imagePath}`;
    }
    return imagePath;
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
