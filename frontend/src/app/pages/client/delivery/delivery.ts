import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { CentreService } from '../../../services/centre';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart-service';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { FloatingAd } from '../../../components/floating-ad/floating-ad';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.css'],
  imports: [Header,Footer, ButtonPrimaire,FloatingAd],
  standalone: true
})
export class Delivery implements OnInit {

  private map!: L.Map;
  footerData: any = {};
  public deliveryMarker: L.CircleMarker | null = null;


  constructor(
    private centreService: CentreService,
    private route: ActivatedRoute,
    public cartService: CartService) {

  }

  
  ngOnInit() {
    this.loadCentreData();
    this.initMap();
    this.markPlace();
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

  


  

  private initMap(): void {
    this.map = L.map('map').setView([-18.9583, 47.5257], 14); // centrée sur Tanjombato

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

     if (this.deliveryMarker) {
      this.map.removeLayer(this.deliveryMarker);
    }

    L.circleMarker([-18.9583, 47.5257], {
      radius: 10,         
      color: 'red',         
      fillColor: '#f03',   
      fillOpacity: 0.5
    }).addTo(this.map)
      .bindPopup('Here we are')
      .openPopup();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

 

  private markPlace(): void{
    this.map.on('click', (e: any) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    if (this.deliveryMarker) {
      this.map.removeLayer(this.deliveryMarker);
    }
    if(this.cartService.currentPanier()?._id){
      this.cartService.setRecuperation(this.cartService.currentPanier()?._id, lat, lng)
    .subscribe({
      next: (res) => {
        console.log("Saved", res);
      },
      error: (err) => {
        console.error(err);
      }
    });


    }

   
    


    this.deliveryMarker=L.circleMarker([lat, lng], {
      radius: 10,         
      color: 'green',         
      fillColor: 'rgb(19, 202, 123)',   
      fillOpacity: 0.5
    }).addTo(this.map)
    });
  }
 



}
