import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { signal, OnInit, OnDestroy } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { AboutCard } from '../../components/about-card/about-card';
import { StoreCard } from '../../components/store-card/store-card';
import {Header} from '../../layout-client/header/header';
import {Footer, FooterData} from '../../layout-client/footer/footer';
import { SectionDivider } from '../../components/section-divider/section-divider';

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
    SectionDivider
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'], 
})
export class Home implements OnInit, OnDestroy {
  // slide for the accueil pictures
  currentSlide = signal(0);
  slides = [
    { title: 'FASHION & BEAUTY', img: '/accueil1.jpg', description: 'Discover the latest trends in fashion and beauty.' },
    { title: 'FOOD & DRINKS', img: '/accueil2.jpeg', description: 'Enjoy a wide variety of delicious food and drinks.' },
    { title: 'LEISURE TIME', img: '/accueil3.png', description: 'Relax and enjoy your leisure time in our comfortable spaces.' }
  ];
  intervalId: any;

  // scroll for the stores section
  stores = [
    { image: '/pasta.png', description: 'PASTA & GELATO' },
    { image: '/abc.png', description: 'ABC' },
    { image: '/pasta.png', description: 'PAPA OURS' },
    { image: '/abc.png', description: 'FOURTH STORE' }
  ];

  canScrollLeft = false;
  canScrollRight = true;

  // Scroll physique
  scroll(direction: 'left' | 'right', element: HTMLElement) {
    const scrollAmount = element.clientWidth; // On scrolle de la largeur du conteneur
    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  // Vérifie si on doit afficher ou cacher les flèches
  checkScroll(element: HTMLElement) {
    this.canScrollLeft = element.scrollLeft > 0;
    
    // On ajoute une marge de 1px pour éviter les erreurs d'arrondi des navigateurs
    const maxScroll = element.scrollWidth - element.clientWidth;
    this.canScrollRight = element.scrollLeft < maxScroll - 1;
  }


  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
    }, 3000);
    // Dans un cas réel, on attendrait que la vue soit chargée
    setTimeout(() => {
       const el = document.querySelector('.no-scrollbar') as HTMLElement;
       if (el) this.checkScroll(el);
    }, 500);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  footerData = {
    title: 'CONTACT',
    phone: '032 88 861 50',
    email: 'email@gmail.com',
    logoUrl: '/logo.jpg',
  };
}
