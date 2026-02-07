import { Component, OnInit, inject, effect} from '@angular/core';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { Boutique } from '../../../services/boutique';
import { Produit } from '../../../services/produit';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ModalForm, TableCorps, ButtonPrimaire, FormsModule],
  templateUrl: './products.html',
})
export class Products  {
  private produitService = inject(Produit);
  private boutiqueService = inject(Boutique);

  productList: any[] = [];
  categories: any[] = [];

  selectedProduct: any = null;
  newPrice: number = 0;

  constructor() {
    effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      
      if (boutique && boutique._id) {
        console.log("Boutique chargée :", boutique._id);
        this.loadData(boutique._id);
      }
    });
  }

  productColumns: TableColumn[] = [
    {key: 'nom', label: 'Name'},
    {key: 'prix', label:'Unit price'},
    {key: 'stock', label:'Stock'},
    { key: 'actions', label: 'Actions' }
  ];

  loadData(boutiqueId: string) {
    // Charger les produits
    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.productList = data.map(p => ({
          ...p,
          prix: `Ar ${p.prix.toLocaleString()}`,
          stock: (p.stock === null || p.stock === undefined) ? 'Not storable' : p.stock
        }));
      },
      error: (err) => console.error('Erreur produits:', err)
    });

    // Charger les catégories
    this.produitService.getCategoriesByBoutique(boutiqueId).subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('Error categories:', err)
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.produitService.deleteProduit(id).subscribe(() => {
        const bId = this.boutiqueService.currentBoutique()?._id;
        if(bId) this.loadData(bId);
      });
    }
  }

  // Modal section create
  isModalAddOpen = false;
  openAddModal() {
    this.isModalAddOpen = true;
  }
  closeAddModal() {
    this.isModalAddOpen = false;
  }

  // Modal section edit
  isModalEditOpen = false;
  openEditModal(product: any) {
    this.selectedProduct = product;
    this.newPrice = Number(product.prix.replace(/[^0-9.-]+/g, ""));
    this.isModalEditOpen = true;
  }
  closeEditModal() {
    this.isModalEditOpen = false;
    this.selectedProduct = null;
  }
  onUpdatePrice() {
    if (this.selectedProduct && this.newPrice > 0) {
      this.produitService.updateProduit(this.selectedProduct._id, { prix: this.newPrice }).subscribe({
        next: () => {
          const bId = this.boutiqueService.currentBoutique()?._id;
          if (bId) this.loadData(bId);
          this.closeEditModal();
        },
        error: (err) => console.error('Update failed', err)
      });
    }
  }
}