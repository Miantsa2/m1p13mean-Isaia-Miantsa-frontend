import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { Boutique } from '../../../services/boutique';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.css'],
  imports: [Header,Footer],
  standalone: true
})
export class Delivery implements OnInit {

  private map!: L.Map;
  footerData: any = null;
  store: any = null;


  constructor(
    private boutiqueService: Boutique,
    private route: ActivatedRoute,) {

  }

  
  // loadStoreDetails(id: string) {
  //   this.boutiqueService.getBoutiquesById(id).subscribe({
  //     next: (data) => {
  //       this.store = data;
        
  //       this.footerData = {
  //         title: data.nom,
  //         phone: data.telephone,
  //         email: data.user?.email,
  //         logoUrl: data.logo || '/image.png'
  //       };
  //     },
  //     error: (err) => console.error('Error stores:', err)
  //   });
  // }


  ngOnInit(): void {
    // const storeId = this.route.snapshot.paramMap.get('id');
    this.initMap();
    this.markPlace();
    // this.loadStoreDetails(storeId)
  }

  

  private initMap(): void {
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

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

 

  private markPlace(): void{
    this.map.on('click', (e: any) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    L.circleMarker([lat, lng], {
      radius: 10,         
      color: 'green',         
      fillColor: 'rgb(19, 202, 123)',   
      fillOpacity: 0.5
    }).addTo(this.map)
    
    console.log('Position:', lat, lng);
  });
  }

}
