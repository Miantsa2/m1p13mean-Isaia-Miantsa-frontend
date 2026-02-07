import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { SalleService } from '../../../services/salle';
import { CentreService } from '../../../services/centre';
import { FormsModule } from '@angular/forms';
import { Boutique } from '../../../services/boutique';
import { Categorie } from '../../../services/categorie';
import { UserService } from '../../../services/user';


@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, ModalForm, FormsModule],
  templateUrl: './rooms.html',
})
export class Rooms implements OnInit {

  roomColumns: TableColumn[] = [
    { key: 'reference', label: 'Room Reference' },
    { key: 'size', label: 'Size in m²' },
    { key: 'date', label: 'Completion date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];
  currentEditingId: string  = '';

  rooms: any[] = []; 
  categories: any[] = [];

  meterPrice: number = 0;
  centreId: string= '';

  selectedRoomName: string = '';
  form: any = {
    nom: '',
    categorie: '',
    salle: '',
    email: '',
    password: '',
    telephone: ''
  };

    filterOptions = {
    statut: 'all',
    ordre: 'desc',
    taille: null as number | null
  };

  newRoom = {
    tailleMetreCarre: 0,
    statut: 'libre',
    reference:''
    
  };

  // Modal section
  isModalOpen = false;
  isPriceModalOpen = false;
  isEditModalOpen = false;
  isModalAssignOpen = false;

  constructor(
    private salleService: SalleService, 
    private centreService: CentreService,
    private userService: UserService,
    private boutiqueService: Boutique,
    private categorieService: Categorie
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadCentre();
    this.loadCategories();
  }

  loadRooms(): void {
    this.salleService.getRoom().subscribe({
      next: (res) => {
        console.log(res);

        this.rooms = res.map((room: any) => ({
          _id: room._id,
          reference: room.reference,
          size: room.tailleMetreCarre,
          date: new Date(room.createdAt).toLocaleDateString(),
          status: room.statut === 'libre' ? 'Free' : 'Occupied'
        }));
        //this.cdr.detectChanges();
        console.log(this.rooms);

      },
      error: (err) => console.error(err)
    });
  }

  loadCentre(): void {
    console.log('Loading centre...');
    this.centreService.getCenter().subscribe({
      next: (res) => {
        const centreData = res[0];
        this.meterPrice = centreData.prixMetreCarre;
        this.centreId= centreData._id;
        console.log('Meter price loaded:', res);
        //this.cdr.detectChanges();
      },
      
      error: (err) => {
        console.error('Error loading meterPrice:', err);
      }
    });
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe({
      next: data => this.categories = data,
      error: err => console.error(err)
    });
  }


  addRoom() {
    this.salleService.addRoom(this.newRoom).subscribe({
      next: (res) => {
        console.log('Success!');
        this.loadRooms(); 
        this.closeCreateModal();
      },
      error: (err) => console.error('Erreur lors de la création', err)
    });
  }


  savePrice() {
    if (!this.centreId) return;

    this.centreService.updatePrice(this.centreId, this.meterPrice).subscribe({
      next: (res) => {
        console.log('Prix mis à jour !');
        this.closePriceModal();
        this.loadCentre(); 
      },
      error: (err) => console.error('Erreur update prix:', err)
    });
  }


  deleteRoom(id: string): void {
    this.salleService.deleteRoom(id).subscribe(() =>
    this.loadRooms());
  }

  onFilterChange(): void {
    const params: any = { ordre: this.filterOptions.ordre };
    
    if (this.filterOptions.statut !== 'all') {
      params.statut = this.filterOptions.statut;
    }
    if (this.filterOptions.taille !== null && this.filterOptions.taille !== undefined) {
      params.taille = this.filterOptions.taille;
    }

    this.salleService.filterSalles(params).subscribe({
      next: (res) => {
        this.rooms = res.map((room: any) => ({
          _id: room._id,
          reference: room.reference,
          size: room.tailleMetreCarre,
          date: new Date(room.createdAt).toLocaleDateString(),
          status: room.statut === 'libre' ? 'Free' : 'Occupied'
        }));
      }
    });
  }

  createStore() {
    console.log("Données du formulaire avant envoi :", this.form);

    if (!this.form.email || !this.form.password) {
      alert("Veuillez remplir l'email et le mot de passe.");
      return;
    }

    const userPayload = {
      email: this.form.email,
      password: this.form.password,
      role: 'boutique'
    };

    this.userService.createUser(userPayload).subscribe({
      next: (user: any) => {
        const boutiquePayload = {
          user: user._id,
          nom: this.form.nom,
          telephone: this.form.telephone,
          categorie: this.form.categorie,
          salle: this.form.salle // Déjà défini dans openAssignModal
        };
        
        this.boutiqueService.createBoutique(boutiquePayload).subscribe({
          next: () => {
            this.loadRooms();
            this.closeAssignModal();
          },
          error: err => console.error("Erreur Boutique:", err)
        });
      },
      error: err => {
        console.error("Erreur User détaillée:", err.error);
        alert("Erreur lors de la création de l'utilisateur : " + (err.error.message || "Champs requis manquants"));
      }
    });
  }
  

  updateRoom() {
    this.salleService.updateRoom(this.currentEditingId, this.newRoom).subscribe({
      next: () => {
        this.loadRooms();
        this.resetFormEvent()
        this.closeEditModal();
      },
      error: (err) => console.error(err)
    });
  
  }







  openCreateModal() { this.isModalOpen = true; }
  closeCreateModal() { this.isModalOpen = false; }

  openPriceModal() { this.isPriceModalOpen = true; }
  closePriceModal() { this.isPriceModalOpen = false; }

  // edit modal
  //openEditModal() { this.isEditModalOpen = true; }

  openEditModal(room: any) {
    this.newRoom = {
      reference: room.reference,
      tailleMetreCarre: room.size,
      statut: room.status === 'Free' ? 'libre' : 'occupee'
    };
    this.currentEditingId= room._id;
    
    this.isEditModalOpen = true;
  }
  closeEditModal() { 
    this.resetFormEvent()
    this.isEditModalOpen = false; 
  }

  resetFormEvent(){
    this.newRoom = {
    tailleMetreCarre: 0,
    statut: 'libre',
    reference:''
    
  };
  }

  // assign modal
  openAssignModal(room: any) {
    this.selectedRoomName = room.reference;
    this.form.salle = room._id;
    this.isModalAssignOpen = true;
  }

  closeAssignModal() {
    this.isModalAssignOpen= false;
    this.resetForm();
  }

  resetForm() {
    this.form = { nom: '', categorie: '', salle: '', email: '', password: '', telephone: '' };
    this.selectedRoomName = '';
  }
}
