import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCard } from '../../components/event-card/event-card';
import { AboutCard } from '../../components/about-card/about-card';
import { StoreCard } from '../../components/store-card/store-card';
import { ProductCard } from '../../components/product-card/product-card';
import { TableCorps, TableColumn } from '../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../components/button-primaire/button-primaire';

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
}
