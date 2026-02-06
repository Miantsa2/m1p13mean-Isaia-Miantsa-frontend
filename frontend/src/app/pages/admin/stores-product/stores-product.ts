import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { Produit } from '../../../services/produit';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stores-product',
  standalone: true,
  imports: [CommonModule, FormsModule, TableCorps, ButtonPrimaire],
  templateUrl: './stores-product.html',
})

export class StoresProduct {
  produits: any[] = [];
  categories: any[] = [];

  selectedCategory = 'all';
  filteredProduits: any[] = [];

  storeName = '';
  searchName = '';

  roomColumns: TableColumn[] = [
    { key: 'nom', label: 'Product name' },
    { key: 'categorie', label: 'Category' },
  ];

  boutiqueId!: string;

  constructor(private route: ActivatedRoute, private produitService: Produit, private location: Location) {}

  ngOnInit() {
    this.boutiqueId = this.route.snapshot.paramMap.get('id')!;
    this.loadCategories();
    this.loadProducts();
  }

  goBack(): void {
    this.location.back();
  }

  loadProducts() {
    this.produitService.getProduitsByBoutique(this.boutiqueId)
      .subscribe((data: any) => {
        this.produits = data;
        this.filteredProduits = data;
        this.storeName = data[0]?.boutique?.nom || '';
      });
  }

  loadCategories() {
    this.produitService.getCategoriesByBoutique(this.boutiqueId)
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProduits = this.produits.filter(p => {
      const categoryMatch = this.selectedCategory === 'all' || p.categorie?._id === this.selectedCategory;
      const searchMatch = p.nom.toLowerCase().includes(this.searchName.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }
}