import { Component, OnInit, inject, effect} from '@angular/core';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { Boutique } from '../../../services/boutique';
import { Produit } from '../../../services/produit';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../../services/categorie';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ModalForm, TableCorps, ButtonPrimaire, FormsModule],
  templateUrl: './products.html',
})
export class Products  {
  private produitService = inject(Produit);
  private boutiqueService = inject(Boutique);
  private categorieService = inject(Categorie);

  searchTerm: string = '';
  productList: any[] = [];
  categories: any[] = [];

  selectedProduct: any = null;
  newPrice: number = 0;

  newProduct = {
    nom:'',
    description:'',
    prix: 0,
    stock: null,
    categorie:''
  }

  isNewCategorie = false;
  newCategoryName = '';
  allCategories: any[] = [];

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

  get filteredProducts() {
    return this.productList.filter(product => 
      product.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  loadData(boutiqueId: string) {
    // Charger les produits
    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.productList = data.map(p => {
          let stockStatus: string | number;

          if (p.stock === null || p.stock === undefined) {
            stockStatus = 'Not storable';
          } 
          else if (p.stock <= 0) {
            stockStatus = 'Out of stock';
          } 
          else {
            stockStatus = p.stock;
          }

          return {
            ...p,
            prix: `Ar ${p.prix.toLocaleString()}`,
            stock: stockStatus
          };
        });
      },
      error: (err) => console.error('Erreur produits:', err)
    });

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

  // load categories
  loadCategories() {
    this.categorieService.getCategories().subscribe(cats => this.allCategories = cats);
  }

  onCategoryChange() {
    this.isNewCategorie = (this.newProduct.categorie === 'OTHER');
  }

  async onCreateProduct() {
    const boutique = this.boutiqueService.currentBoutique();
    const boutiqueId = boutique?._id;
    if(!boutiqueId) return;

    let finalCategoryId = this.newProduct.categorie;

    if(this.isNewCategorie && this.newCategoryName.trim() !== '') {
      try {
        const res = await this.categorieService.createCategory({ nom: this.newCategoryName}).toPromise();
        finalCategoryId = res._id;
      }catch(err) {
        console.error("Error creating categories", err);
        return;
      }
    }

    // 2. 
    const productToSave = {
      ...this.newProduct,
      categorie: finalCategoryId,
      boutique: boutiqueId
    };

    // 3.
    this.produitService.createProduit(productToSave).subscribe({
      next: () => {
        this.loadData(boutiqueId);
        this.closeAddModal();
        this.resetCreateForm();
      },
      error: (err) => console.error("Error creating product", err)
    });
  }

  resetCreateForm() {
    this.newProduct = { nom: '', description: '', prix: 0, stock: null, categorie: '' };
    this.isNewCategorie = false;
    this.newCategoryName = '';
  }

  // Appeler loadCategories à l'ouverture de la modale
  
  // Modal section create
  isModalAddOpen = false;
  openAddModal() {
    this.loadCategories();
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