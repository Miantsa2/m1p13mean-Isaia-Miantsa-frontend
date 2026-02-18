import { Component, OnInit, effect } from '@angular/core';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { CentreService } from '../../../services/centre';
import { CartService } from '../../../services/cart-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livraison',

  standalone: true,
  imports: [Footer, Header,CommonModule],
  templateUrl: './livraison.html',
})
export class Livraison implements OnInit {
  footerData: any = {};
  allDeliveries: any[] = [];
  filteredDeliveries: any[] = [];
  stores: string[] = [];
  
  
  selectedStore: string = 'all';
  sortOrder: 'recent' | 'old' = 'recent';
  constructor(private centreService: CentreService, public cartService: CartService) {
    effect(() => {
      const client = this.cartService.currentClient();
      if (client && client._id) {
        this.loadDeliveries(client._id);
      }
    });
  }

  ngOnInit(): void {
    this.loadCentreData();
    // const clientId = this.cartService.currentClient()?._id;
    // if (clientId) {
    //   this.loadDeliveries(clientId);
    // }
  }

  loadDeliveries(clientId: string) {
    this.cartService.getDeliveryHistory(clientId).subscribe({
      next: (data) => {
        this.allDeliveries = data;
        this.stores = [...new Set(data.map(d => d.storeName))];
        this.applyFilters();
      },
      error: (err) => console.error('Error deliveries:', err)
    });
  }

  applyFilters() {
    let temp = [...this.allDeliveries];

    if (this.selectedStore !== 'all') {
      temp = temp.filter(d => d.storeName === this.selectedStore);
    }

    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    this.filteredDeliveries = temp;
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
}