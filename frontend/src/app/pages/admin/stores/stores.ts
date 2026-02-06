import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { StoreCardAdmin } from '../../../components/store-card-admin/store-card-admin';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { Boutique } from '../../../services/boutique';
import { Categorie } from '../../../services/categorie';
import { SalleService } from '../../../services/salle';
import { UserService } from '../../../services/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stores',
    standalone: true,
    imports: [ButtonPrimaire, CommonModule, StoreCardAdmin, ModalForm, FormsModule],
  templateUrl: './stores.html',
})
export class Stores {
  stores: any[] = [];
  filteredStores: any[] = [];
  categories: any[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  freeRooms: any[] = [];

  form: any = {
    nom: '',
    categorie: '',
    salle: '',
    email: '',
    password: '',
    telephone: ''
  };

  constructor(
    private boutiqueService: Boutique,
    private categorieService: Categorie,
    private salleService: SalleService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBoutiques();
    this.loadFreeRooms();
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe({
      next: data => this.categories = data,
      error: err => console.error(err)
    });
  }

  loadBoutiques() {
    this.boutiqueService.getBoutiques().subscribe(data => {
      console.log('BOUTIQUES =>', data);
      this.stores = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredStores = this.stores.filter(store => {
      const matchesCategory = this.selectedCategory === 'all' || 
                              store.categorie === this.selectedCategory || 
                              store.categorie?._id === this.selectedCategory;

      const matchesName = store.nom.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesCategory && matchesName;
    });
  }

  loadFreeRooms() {
    this.salleService.getFreeRoom().subscribe({
      next: data => this.freeRooms = data,
      error: err => console.error(err)
    });
  }

  createStore() {
    // create user
    const userPayload = {
      email: this.form.email,
      password: this.form.password,
      role: 'boutique'
    };
    this.userService.createUser(userPayload).subscribe({
      next: (user: any) => {
        // create boutique
        const boutiquePayload = {
          user: user._id,
          nom: this.form.nom,
          telephone: this.form.telephone,
          categorie: this.form.categorie,
          salle: this.form.salle
        };
        this.boutiqueService.createBoutique(boutiquePayload).subscribe({
          next: () => {
            this.loadBoutiques();
            this.loadFreeRooms();
            this.closeAddModal();
          },
          error: err => console.error(err)
        });
      },
      error: err => console.error(err)
    });
  }

  // Modal ajout
  isModalAddOpen = false;
  openAddModal() {this.isModalAddOpen = true};
  closeAddModal() {this.isModalAddOpen = false};
}