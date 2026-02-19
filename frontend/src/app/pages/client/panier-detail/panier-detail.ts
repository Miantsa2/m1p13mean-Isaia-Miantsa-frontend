import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { CentreService } from '../../../services/centre';
import { CartService } from '../../../services/cart-service';
import { RouterModule } from '@angular/router';
import { FloatingAd } from '../../../components/floating-ad/floating-ad';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-panier-detail',
  standalone: true,
  imports: [Header, Footer, CommonModule, RouterModule,FloatingAd ],
  templateUrl: './panier-detail.html',
})
export class PanierDetail implements OnInit {
  readonly apiUrl = environment.apiUrl;
  
  footerData: any = {};

  constructor(private centreService: CentreService, public cartService: CartService) {}

  ngOnInit() {
    this.loadCentreData();
  }

  loadCentreData() {
    this.centreService.getCenter().subscribe({
      next: (data) => {
        const center = Array.isArray(data) ? data[0] : data;
        if (center) {
          this.footerData = {
            title: 'CONTACT',
            phone: center.telephone || '032 58 861 59',
            email: center.email || 'email@gmail.com',
            logoUrl: center.logo || '/image.png'
          };
        }
      },
      error: (err) => console.error('Error getting info :', err)
    });
  }

  getProductImage(imagePath: string): string {
    if (!imagePath) return '/image.png';
    
    if (imagePath.startsWith('/uploads')) {
      return `${this.apiUrl}${imagePath}`;
    }
    
    return imagePath;
  }

}
