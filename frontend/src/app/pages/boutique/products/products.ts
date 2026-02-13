import { Component, OnInit, inject, effect} from '@angular/core';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { Boutique } from '../../../services/boutique';
import { Produit } from '../../../services/produit';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../../services/categorie';
import { InvoiceCorps , clientData, InvoiceColumn, InvoiceSummaryItem} from '../../../components/invoice/invoice';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { CentreService } from '../../../services/centre';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ModalForm, TableCorps, ButtonPrimaire, FormsModule, InvoiceCorps],
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

  sponsorData = {
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: ''
  };

  clientData: clientData = {
    name: '',
    email: ''
  };

  stripe!: Stripe | null;
  elements!: StripeElements;
  card: any;
  clientSecret: string = '';

  private key = environment.STRIPE_PUBLIC_KEY;

   currentCenter: any;
  currentCenterId: string = '';

    ngOnInit(): void {
      this.loadCentre();

    }


  loadCentre(): void {
    this.centreService.getCenter().subscribe({
      next: (res) => {
        this.currentCenter = res[0];
        this.currentCenterId = res[0]._id;
        console.log("Centre chargé :", this.currentCenter);
      }
    });
  }


  constructor(private centreService: CentreService) {
    effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      
      if (boutique && boutique._id) {
        console.log("Boutique chargée :", boutique._id);
        this.loadData(boutique._id);
        this.clientData.name = boutique.nom || '';
        this.clientData.email = boutique.user?.email || '';
      }
    });
  }

  productColumns: TableColumn[] = [
    {key: 'nom', label: 'Name'},
    {key: 'prix', label:'Unit price'},
    {key: 'stock', label:'Stock'},
    { key: 'actions', label: 'Actions' }
  ];



  invoice={
    produitId: '',
    produitNom: '',
    produitPrix: 0,
    dateDebut: '',
    dateFin: '',
    duree: '',
    currency: '',
    amount: 0,
  }

  invoiceColumns: InvoiceColumn[] = [
    {key: 'produitNom', label: 'Produit'},
    {key: 'produitPrix', label:'Unit price'},
    {key: 'duree', label:'Duration'},
    { key: 'currency', label: 'Currency' }
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


  onUpdateSponsor() {
    if (this.selectedProduct) {
      const body = {
      sponsor: {
        dateDebut: this.sponsorData.dateDebut,
        dateFin: this.sponsorData.dateFin
      }
    };
      this.produitService.updateProduit(this.selectedProduct._id, body).subscribe({
        next: () => {
          console.log('update sponsor success');
          const notif = {
            titre: 'Sponsor Payement',
            description: `Store  ${this.boutiqueService.currentBoutique()?.nom} has paid a sponsor for ${this.selectedProduct.reference}. `
          }; 

          this.centreService.addNotif(this.currentCenterId, notif).subscribe({
            next: () => {
              console.log('Notification envoyée au centre');
            },

            error: (err) => {
              console.error('Erreur notification', err);
            }
        }); 
        },

        error: (err) => console.error('Update failed', err)
      });
    }
  }

  isSponsorModalOpen = false;

  openSponsorModal(product: any) {
    this.selectedProduct = product;
    this.isSponsorModalOpen = true;
  }

  private async initStripe() {
    this.stripe = await loadStripe(this.key);
    if (!this.stripe) {
      console.error("Impossible de charger Stripe");
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', { hidePostalCode: true });
    setTimeout(() => {
      this.card.mount('#card-element');
    }, 0);


  }

  isModalInvoiceOpen= false;
  invoiceSummary: InvoiceSummaryItem[] = [];


  openInvoiceModal() {
    this.closeSponsorModal();
    this.produitService.makeInvoice(this.selectedProduct._id, this.sponsorData).subscribe({
      next: (res) => {
        this.invoice = res.invoice;
        this.clientSecret = res.clientSecret;
        this.invoiceSummary = [
          { label: 'Total', value: res.invoice.amount },
          { label: 'Delivery', value: 5000 },
          { label: 'Final amount', value: res.invoice.amount + 5000, bold: true },
        ];

        this.initStripe(); 
      },
      error: (err) => {
        console.error('Invoice generation failed', err);
      }
      
      
    });
    this.isModalInvoiceOpen = true;
  }

 


  
  async confirmPayment() {
    if (!this.stripe || !this.card) return;

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card: this.card }
    });

    if (result.error) {
      const el = document.getElementById('card-errors');
      if (el) el.textContent = result.error.message!;
    } 
    else if (result.paymentIntent?.status === 'succeeded') {
      alert("Paiement réussi !");
      this.onUpdateSponsor();
       
      this.closeInvoiceModal();
    }
  }

  isSponsorActive(product: any): boolean {
  if (!product?.sponsor?.dateDebut || !product?.sponsor?.dateFin) {
    return false;
  }

  const now = new Date();
  const start = new Date(product.sponsor.dateDebut);
  const end = new Date(product.sponsor.dateFin);

  return now >= start && now <= end;
}

isFormValid(): boolean {
  return this.sponsorData.dateDebut !== '' && this.sponsorData.dateFin !== '' && new Date(this.sponsorData.dateDebut) < new Date(this.sponsorData.dateFin);
}







  


  closeInvoiceModal() {
    this.isModalInvoiceOpen = false;
  }

  closeSponsorModal() {
    this.isSponsorModalOpen = false;
  }
}