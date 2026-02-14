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
  showOnlyPromos: boolean = false;
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

  promoData = {
    pourcentage: 0,
    dateDebut: '',
    dateFin: ''
  };

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
    {key: 'stock', label:'Initial stock'},
    { key: 'actions', label: 'Actions' }
  ];

  get filteredProducts() {
    return this.productList.filter(product => {
      const matchesSearch = product.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPromoFilter = this.showOnlyPromos ? product.isPromoActive : true;
      
      return matchesSearch && matchesPromoFilter;
    });
  }

  loadData(boutiqueId: string) {
    // Charger les produits
    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        const now = new Date().getTime();

        this.productList = data.map(p => {
          let promoValide = false;
          if (p.promotions && p.promotions.pourcentage > 0 && p.promotions.dateFin) {
            const fin = new Date(p.promotions.dateFin).getTime();
            const debut = new Date(p.promotions.dateDebut).getTime();
            promoValide = now >= debut && now <= fin;
          }

          const prixInitial = p.prix;
          let prixFinal = prixInitial;
          if (promoValide) {
            prixFinal = prixInitial * (1 - p.promotions.pourcentage / 100);
          }

          let stockStatus = p.stock ?? 'Not storable';
          if (p.stock <= 0 && p.stock !== null) stockStatus = 'Out of stock';

          return {
            ...p,
            prixInitial: prixInitial, 
            isPromoActive: promoValide,
            prix: `Ar ${prixFinal.toLocaleString()}`,
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

  // Modal section promote
  isModalPromoteOpen = false;
  openModalPromoteOpen(product: any) {
    this.selectedProduct = product;
    if(product.promotions && product.promotions.pourcentage > 0) {
      this.promoData = {
        pourcentage: product.promotions.pourcentage,
        dateDebut: new Date(product.promotions.dateDebut).toISOString().split('T')[0],
        dateFin: new Date(product.promotions.dateFin).toISOString().split('T')[0]
      };
    } else {
      this.promoData = { pourcentage: 0, dateDebut: '', dateFin: '' };
    }
    this.isModalPromoteOpen = true;
  }

  // prix final pour l'affichage dans la modale
    get discountedPrice(): number {
      if (!this.selectedProduct) return 0;
      return this.selectedProduct.prixInitial * (1 - this.promoData.pourcentage / 100);
    }

  onConfirmPromo() {
    this.produitService.updatePromotion(this.selectedProduct._id, this.promoData).subscribe({
        next: () => {
            this.productList = this.productList.map(p => {
                if (p._id === this.selectedProduct._id) {
                    return {
                        ...p,
                        promotions: { ...this.promoData },
                        isPromoActive: true
                    };
                }
                return p;
            });

            const bId = this.boutiqueService.currentBoutique()?._id;
            if (bId) this.loadData(bId);

            this.closeModalPromoteOpen();
        },
        error: (err) => console.error("Erreur promo:", err)
    });
  }

  onCancelPromo() {
    this.produitService.updatePromotion(this.selectedProduct._id, null).subscribe({
      next: () => {
        this.productList = this.productList.map(p => {
          if (p._id === this.selectedProduct._id) {
            return { 
              ...p, 
              promotions: null,
              isPromoActive: false,
              prix: `Ar ${p.prixInitial.toLocaleString()}`
            };
          }
          return p;
        });
        this.closeModalPromoteOpen();
      }
    });
  }

  closeModalPromoteOpen() {
    this.isModalPromoteOpen = false;
  }
}