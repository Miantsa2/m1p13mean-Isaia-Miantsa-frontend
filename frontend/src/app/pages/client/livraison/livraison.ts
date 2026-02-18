import { Component, OnInit, effect } from '@angular/core';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { CentreService } from '../../../services/centre';
import { CartService } from '../../../services/cart-service';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';


@Component({
  selector: 'app-livraison',

  standalone: true,
  imports: [Footer, Header,CommonModule],
  templateUrl: './livraison.html',
  styleUrls: ['./livraison.css'],
})
export class Livraison implements OnInit {
  footerData: any = {};
  allDeliveries: any[] = [];
  filteredDeliveries: any[] = [];
  stores: string[] = [];
  
  private map!: L.Map;
  public deliveryMarker: L.CircleMarker | null = null;
  
  selectedStore: string = 'all';
  sortOrder: 'recent' | 'old' = 'recent';
  constructor(private centreService: CentreService, public cartService: CartService) {
    effect(() => {
      const client = this.cartService.currentClient();
      if (client && client._id) {
        this.loadDeliveries(client._id);
        this.initMap(client._id);
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



   private initMap(clientId: string): void {
      this.map = L.map('map').setView([-18.9583, 47.5257], 14); // centrée sur Tanjombato
  
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
  
       
  
      L.circleMarker([-18.9583, 47.5257], {
        radius: 10,         
        color: 'red',         
        fillColor: '#f03',   
        fillOpacity: 0.5
      }).addTo(this.map)
        .bindPopup('Here we are')
        .openPopup();
      this.cartService.getDeliveryPlace(clientId).subscribe({
      next: (data) => {
        if (!Array.isArray(data)) return;

        data.forEach((panier, index) => {

          const lat = panier.recuperation?.coo_x;
          const lng = panier.recuperation?.coo_y;

          if (lat && lng) {
            L.circleMarker([lat, lng], {
              radius: 8,
              color: 'green',
              fillColor: 'rgb(19, 202, 123)',
              fillOpacity: 0.6
            })
            .addTo(this.map)
            .bindPopup(`<b>Cart ${data.length - index}</b>`)
            .openPopup();
          }

        });
      },
      error: (err) => console.error('Error deliveries:', err)
    });
 
    setTimeout(() => {
        this.map.invalidateSize();
      }, 200);
    }
}