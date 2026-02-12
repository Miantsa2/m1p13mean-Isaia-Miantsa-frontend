import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../components/button-primaire/button-primaire';
import { Categorie } from '../../services/categorie';
import { Router, RouterModule } from '@angular/router';
import { CentreService } from '../../services/centre';

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

  categories: any[] = [];
  showDropdown = false;
  centreInfo: any = null;

  isLoggedIn = false;

  constructor(private categorieService: Categorie, private router: Router, private centreService: CentreService) {}

  ngOnInit() {
    this.loadCentreData();
    this.checkLoginStatus();
    this.categorieService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  checkLoginStatus() {
    const user = localStorage.getItem('token');
    this.isLoggedIn = !!user; 
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
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}