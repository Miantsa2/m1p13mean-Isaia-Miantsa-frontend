import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../components/button-primaire/button-primaire';
import { Categorie } from '../../services/categorie';
import { Router, RouterModule } from '@angular/router';
import { CentreService } from '../../services/centre';
import { CartService } from '../../services/cart-service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuthService } from '../../services/auth';


export type HeaderType = 'header1' | 'header2' | 'header3';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonPrimaire, RouterModule],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  @Input() headerType: HeaderType = 'header1';
  @Output() categorySelected = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();
  @Input() invoiceElement!: HTMLElement | null;

  categories: any[] = [];
  showDropdown = false;
  centreInfo: any = null;

  isLoggedIn = false;
  isMenuOpen = false;

  constructor(
    private categorieService: Categorie, 
    private router: Router, 
    private centreService: CentreService,
    public cartService : CartService,
    private authService: AuthService, ) {}

  ngOnInit() {
    this.loadCentreData();
    this.checkLoginStatus();
    this.categorieService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  goBack() {
    window.history.back();
  }

  checkLoginStatus() {
    const user = localStorage.getItem('token');
    this.isLoggedIn = !!user; 
  }

  toggleMenuAndScroll(sectionId: string) {
    this.isMenuOpen = false;
    this.scrollToSection(sectionId);
  }

  loadCentreData() {
    this.centreService.getCenter().subscribe({
      next: (data) => {
        this.centreInfo = Array.isArray(data) ? data[0] : data;
      },
      error: (err) => console.error('Error loading center', err)
    });
  }

  selectCategory(categoryId: string) {
    this.categorySelected.emit(categoryId);
    this.showDropdown = false;
    document.getElementById('stores-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSearch(event: any) {
    const term = event.target.value;
    this.searchChanged.emit(term);
    if (term.length >= 2) {
      if(this.headerType === 'header2') {
        this.scrollToSection('products-section');
      }else {
        this.scrollToSection('stores-section');
      }
    }
  }

  // logout client
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }


   

  async downloadPDF() {
    if (!this.invoiceElement) {
      console.error("No invoice element provided");
      return;
    }

    // Capture avec html2canvas
    const canvas = await html2canvas(this.invoiceElement, {
      scale: 2,           
      useCORS: true,
      backgroundColor: '#ffffff',
      ignoreElements: (el) => el.classList.contains('no-pdf')
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4'); // format A4 portrait

    const pdfWidth = 180; // largeur du contenu dans PDF en mm (210 max pour A4 avec marge)
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 15, 15, pdfWidth, pdfHeight); // 15 mm de marge
    pdf.save('invoice.pdf');
  }

}