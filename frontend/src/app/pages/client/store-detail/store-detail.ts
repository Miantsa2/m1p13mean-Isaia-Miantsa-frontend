import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Boutique } from '../../../services/boutique';
import { Produit } from '../../../services/produit';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { CommonModule } from '@angular/common';
import { SectionDivider } from '../../../components/section-divider/section-divider';
import { ProductCard } from '../../../components/product-card/product-card';
import { EvenementService } from '../../../services/evenement';
import { EventCard } from '../../../components/event-card/event-card';
@Component({
  selector: 'app-store-detail',
  standalone: true,
  imports: [Header, ProductCard,Footer, CommonModule, SectionDivider, EventCard],
  templateUrl: './store-detail.html',
})
export class StoreDetail implements OnInit {
  store: any = null;
  allProducts: any[] = [];
  filteredProducts = signal<any[]>([]);
  productCategories: any[] = []; 
  footerData: any = null;
  selectedCategory: string = 'all';
  events = signal<any[]>([]);

  canScrollLeft = false;
  canScrollRight = false;

  showOnlyPromos = false;

  searchTerm: string = '';

  canScrollLeftEvents = false;
  canScrollRightEvents = true;


  constructor(
    private route: ActivatedRoute,
    private boutiqueService: Boutique,
    private produitService: Produit,
    private eventService: EvenementService,
    
  ) {}

  ngOnInit() {
    const storeId = this.route.snapshot.paramMap.get('id');
    if (storeId) {
      this.loadStoreDetails(storeId);
      this.loadStoreCategories(storeId);
      this.loadStoreProducts(storeId);
      this.loadEvents(storeId);

    }    
  }

  loadStoreDetails(id: string) {
    this.boutiqueService.getBoutiquesById(id).subscribe({
      next: (data) => {
        this.store = data;
        
        this.footerData = {
          title: data.nom,
          phone: data.telephone,
          email: data.user?.email,
          logoUrl: data.logo || '/image.png'
        };
      },
      error: (err) => console.error('Error stores:', err)
    });
  }

  loadStoreProducts(id: string) {
    this.produitService.getProduitsByBoutique(id).subscribe(data => {
      this.allProducts = data;
      this.filteredProducts.set(data);
      setTimeout(() => {
        const container = document.querySelector('.product-container') as HTMLDivElement;
        if (container) this.checkScroll(container);
      }, 100);
    });
  }

  loadStoreCategories(id: string) {
    this.produitService.getCategoriesByBoutique(id).subscribe(data => {
      this.productCategories = data;
    });
  }

  loadEvents(id: string) {
    this.eventService.getApprouvedEventsByBoutiqueId(id,'approuved').subscribe({
      next: (data) => {
        this.events.set(data);
        setTimeout(() => this.checkScrollEvents(), 100);
      },
      error: (err) => console.error('Error loading events:', err)
    });
  }


  handleSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  filterByPromo() {
    this.showOnlyPromos = !this.showOnlyPromos;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.allProducts;

    // 1. Nom de produit
    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(this.searchTerm)
      );
    }

    // 2. Par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categorie?._id === this.selectedCategory);
    }

    // 3. Par promo 
    if (this.showOnlyPromos) {
      const now = new Date();
      filtered = filtered.filter(p => {
        if (!p.promotions) return false;
        const start = new Date(p.promotions.dateDebut);
        const end = new Date(p.promotions.dateFin);
        return now >= start && now <= end;
      });
    }

    this.filteredProducts.set(filtered);
    
    setTimeout(() => {
      const container = document.querySelector('.product-container') as HTMLDivElement;
      if (container) this.checkScroll(container);
    }, 100);
  }

  scroll(direction: 'left' | 'right', element: HTMLDivElement) {
    const scrollAmount = element.clientWidth;
    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  checkScroll(element: HTMLDivElement) {
    this.canScrollLeft = element.scrollLeft > 0;
    this.canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth - 5);
  }

  
  scrollEvents(direction: 'left' | 'right', element: HTMLElement) {
    const scrollAmount = element.clientWidth;
    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  checkScrollEvents() {
    const el = document.querySelector('.events-container') as HTMLElement;
    if (el) {
      this.canScrollLeftEvents = el.scrollLeft > 0;
      const maxScroll = el.scrollWidth - el.clientWidth;
      this.canScrollRightEvents = el.scrollLeft < maxScroll - 1;
    }
  }



}
