import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCard } from '../../components/event-card/event-card';
import { AboutCard } from '../../components/about-card/about-card';
import { StoreCard } from '../../components/store-card/store-card';
import { ProductCard } from '../../components/product-card/product-card';
import { TableCorps, TableColumn } from '../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../components/button-primaire/button-primaire';
import {Header} from '../../layout-client/header/header';
import {Footer, FooterData} from '../../layout-client/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    EventCard,
    AboutCard,
    StoreCard,
    ProductCard,
    TableCorps,
    ButtonPrimaire,
    Header,
    Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'], 
})
export class Home {
  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Nom' },
    { key: 'category', label: 'Catégorie' },
    { key: 'price', label: 'Prix (Ar)' },
  ];

  tableRows = [
    { name: 'Linguine', category: 'Pâtes', price: 25000 },
    { name: 'Gelato', category: 'Dessert', price: 12000 },
    { name: 'Pizza', category: 'Fast food', price: 30000 },
  ];

  footerData = {
    title: 'CONTACT',
    phone: '032 88 861 50',
    email: 'email@gmail.com',
    logoUrl: '/logo.jpg',
  };

}
