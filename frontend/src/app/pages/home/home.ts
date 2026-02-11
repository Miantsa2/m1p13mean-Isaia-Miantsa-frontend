import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, OnInit, OnDestroy } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { AboutCard } from '../../components/about-card/about-card';
import { StoreCard } from '../../components/store-card/store-card';
import {Header} from '../../layout-client/header/header';
import {Footer, FooterData} from '../../layout-client/footer/footer';
import { SectionDivider } from '../../components/section-divider/section-divider';
import { CentreService } from '../../services/centre';
import { FormsModule } from '@angular/forms';
import { EvenementService } from '../../services/evenement';
import { Boutique } from '../../services/boutique';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    EventCard,
    AboutCard,
    StoreCard,
    Header,
    Footer,
    SectionDivider,
    FormsModule
  ],
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {

  constructor(
    private centreService: CentreService,
    private eventService: EvenementService,
    private boutiqueService: Boutique
  ) {}

  centreInfo: any = null;
  events = signal<any[]>([]);
  allStores: any[] = [];

  canScrollLeftEvents = false;
  canScrollRightEvents = true;

  footerData: FooterData = {
    title: 'Loading...',
    phone: '',
    email:'',
    logoUrl: ''
  }

  // slide for the accueil pictures
  currentSlide = signal(0);
  slides = [
    { title: 'FASHION & BEAUTY', img: '/accueil1.jpg', description: 'Discover the latest trends in fashion and beauty.' },
    { title: 'FOOD & DRINKS', img: '/accueil2.jpeg', description: 'Enjoy a wide variety of delicious food and drinks.' },
    { title: 'LEISURE TIME', img: '/accueil3.png', description: 'Relax and enjoy your leisure time in our comfortable spaces.' }
  ];
  intervalId: any;

  // scroll for the stores section
  stores = signal<any[]>([]);

  canScrollLeft = false;
  canScrollRight = true;

  // Scroll physique
  scroll(direction: 'left' | 'right', element: HTMLElement) {
    const scrollAmount = element.clientWidth;
    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  // Vérifie si on doit afficher ou cacher les flèches
  checkScroll(element: HTMLElement) {
    this.canScrollLeft = element.scrollLeft > 0;
    
    const maxScroll = element.scrollWidth - element.clientWidth;
    this.canScrollRight = element.scrollLeft < maxScroll - 1;
  }


  ngOnInit() {
    this.loadCentreData();
    this.loadEvents();
    this.loadStores();
    this.intervalId = setInterval(() => {
      this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
    }, 3000);
    setTimeout(() => {
       const el = document.querySelector('.no-scrollbar') as HTMLElement;
       if (el) this.checkScroll(el);
    }, 500);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadCentreData() {
    this.centreService.getCenter().subscribe({
      next: (data) => {
        const center = Array.isArray(data) ? data[0] : data;

        if (center) {
          this.centreInfo = center;

          this.footerData = {
            title: center.nom || 'Name not defined',
            phone: center.telephone || 'Contact undefined',
            email: center.email || '',
            logoUrl: center.logo || '/image.png'
          };
        } else {
          console.warn('No centre data found in the response');
        }
      },
      error: (err) => {
        console.error('Error getting info :', err);
      }
    });
  }

  loadStores() {
    this.boutiqueService.getBoutiques().subscribe({
      next: (data) => {
        this.allStores = data;
        this.stores.set(data);
        setTimeout(() => {
          const el = document.querySelector('.no-scrollbar') as HTMLElement;
          if (el) this.checkScroll(el);
        }, 200);
      },
      error: (err) => console.error('Error loading stores:', err),
    });
  }

  filterStores(categoryId: string) {
    this.boutiqueService.getBoutiques().subscribe(allBoutiques => {
      if (!categoryId) {
        this.stores.set(allBoutiques); 
      } else {
        const filtered = allBoutiques.filter(b => b.categorie === categoryId || b.categorie?._id === categoryId);
        this.stores.set(filtered);
      }
      setTimeout(() => this.checkScroll(document.querySelector('.no-scrollbar') as HTMLElement), 100);
    });
  }

  applyFilter(searchTerm: string) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.stores.set(this.allStores);
    } else {
      const filtered = this.allStores.filter(store => 
        store.nom.toLowerCase().includes(term) || 
        (store.description && store.description.toLowerCase().includes(term))
      );
      this.stores.set(filtered);
    }
  }

  loadEvents() {
    this.eventService.getEventsByType().subscribe({
      next: (data) => {
        this.events.set(data);
        setTimeout(() => this.checkScrollEvents(), 100);
      },
      error: (err) => console.error('Error loading events:', err)
    });
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

  // To get the first horaire in the data
  get firstDaySchedule(): string {
    if (this.centreInfo?.horaires?.length > 0) {
      const first = this.centreInfo.horaires[0];
      return `Schedule: ${first.ouverture} - ${first.fermeture}`;
    }
    return 'Schedule: Not available';
  }
}