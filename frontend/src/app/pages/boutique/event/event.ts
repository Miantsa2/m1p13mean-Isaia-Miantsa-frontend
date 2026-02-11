import { Component, OnInit,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { EvenementService } from '../../../services/evenement';
import { FormsModule } from '@angular/forms';
import { Boutique } from '../../../services/boutique';
import { CentreService } from '../../../services/centre';




@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, ModalForm, FormsModule],
  templateUrl: './event.html',
})


export class StoresEvent implements OnInit {

  eventColumns: TableColumn[] = [
    { key: 'reference', label: 'Event Reference' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'RequestDate' },
    { key: 'dateDebut', label: 'Start Date' },
    { key: 'dateFin', label: 'End Date' },
    { key: 'statut', label: 'Status' },
    { key: 'actions', label: 'Actions' },


  
  ];
  events: any[] = [];
  
  // Modal section
  isModalOpen = false;
  isEditModalOpen = false;
  
  filterOptions = {
    statut: 'all',
    ordre: 'desc'
  };

  boutique: any;
  boutiquecurrentId: string = '';

  newEvent = {
    reference: '',
    type: 'boutique',
    statut: 'pending',
    description:'',
    dateDebut:'',
    dateFin:'',
    boutique: '',
  };

  currentEditingId= '';
  currentCenter: any;
  currentCenterId: string = '';
  

  constructor(
    private evenementService: EvenementService,
    private boutiqueService: Boutique,
    private centreService: CentreService

  ) {}




  ngOnInit(): void {
    this.loadBoutique();

  }


  loadBoutique() {
    this.boutiqueService.getBoutique().subscribe({
      next: (data) => {
        this.boutique = data;
        this.boutiquecurrentId = data._id;
        console.log("Boutique chargée :", this.boutique);
            this.loadEvents();
            this.loadCentre();
      },

      error: (err) => console.error('Erreur chargement boutique', err)
    });
  }



  loadEvents(): void {
    console.log("Boutique ID:", this.boutique);
    this.evenementService.getEventsByBoutiqueId(this.boutique._id).subscribe({
      next: (res) => {
        console.log(res);

        this.events = res.map((event: any) => ({
          _id: event._id,
          reference: event.reference,
          description: event.description,
          dateDebut: new Date(event.dateDebut),
          dateFin: new Date(event.dateFin),
          createdAt: new Date(event.createdAt),
          statut: event.statut,
          createdAtFormatted: new Date(event.createdAt).toLocaleString(),
          dateDebutFormatted: new Date(event.dateDebut).toLocaleString(),
          dateFinFormatted: new Date(event.dateFin).toLocaleString()
        }));
        console.log(this.events);

      },
      error: (err) => console.error(err)
    });
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



  deleteEvent(id: string): void {
    this.evenementService.deleteEvent(id).subscribe(() =>
    this.loadEvents());
  }

  addEvent() {
    this.newEvent.boutique = this.boutiquecurrentId;
    console.log("Creating event with data:", this.newEvent);
    this.evenementService.addEvent(this.newEvent).subscribe({
      next: (res) => {
         const notif = {
          titre: 'Event Request',
          description: `${this.boutique.nom} created an event .`
        };

        this.centreService.addNotif(this.currentCenterId, notif).subscribe({
          next: () => {
            console.log('Notification envoyée ');
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        });
        console.log('Success event create!');
        this.loadBoutique(); 
        this.resetEventForm();
        this.closeCreateModal();
      },
      error: (err) => alert(err.error.message)
    });
  }


  
  updateEvent() {
    this.evenementService.updateEvent(this.currentEditingId, this.newEvent).subscribe({
      next: () => {
        this.loadEvents();
        this.resetEventForm();
        this.closeEditModal();
      },
      error: (err) => console.error(err)
    });
  
  }

  resetEventForm(){
      this.newEvent = {
      reference: '',
      type: 'boutique',
      statut: 'pending',
      description:'',
      dateDebut:'',
      dateFin:'',
      boutique: this.boutiquecurrentId
    };
  }

  onFilterChange(): void {
    const params: any = { ordre: this.filterOptions.ordre };
     if (this.filterOptions.statut !== 'all') {
      params.statut = this.filterOptions.statut;
    }

  
      params.boutiqueId = this.boutiquecurrentId;
    
    
    this.evenementService.filterStoreEvents(params).subscribe({
      next: (res) => {
          this.events = res.map((event: any) => ({
          _id: event._id,
          reference: event.reference,
          description: event.description,
          dateDebut: new Date(event.dateDebut),
          dateFin: new Date(event.dateFin),
          createdAt: new Date(event.createdAt),
          statut: event.statut,
          createdAtFormatted: new Date(event.createdAt).toLocaleString(),
          dateDebutFormatted: new Date(event.dateDebut).toLocaleString(),
          dateFinFormatted: new Date(event.dateFin).toLocaleString()
        }));
        console.log(this.events);
      },
      error: (err) => console.error(err)
    });
  }

  

  isEventFormInvalid(): boolean {
    if (!this.newEvent.reference || !this.newEvent.description || !this.newEvent.dateDebut || !this.newEvent.dateFin) {
      return true; 
    }
    const debut = new Date(this.newEvent.dateDebut);
    const fin = new Date(this.newEvent.dateFin);

    if (debut >= fin) {
      return true;
    }

    const maintenant = new Date();
    if (!this.currentEditingId) {
    if (debut < maintenant) {
      return true;
    }
  }

    return false; 
  }


 
  openCreateModal() { this.isModalOpen = true; }
  closeCreateModal() { this.isModalOpen = false; }

  formatDateForInput(dateInput: string | Date): string {
    if (!dateInput) return '';

    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  // edit modal
  openEditModal(event: any) {
    this.newEvent = {
      reference: event.reference,
      type: 'boutique',
      statut: event.statut,
      description:event.description,
      dateDebut: this.formatDateForInput(event.dateDebut),
      dateFin:this.formatDateForInput(event.dateFin),
      boutique: this.boutiquecurrentId
    };
    this.currentEditingId= event._id
    this.isEditModalOpen = true; 
    }
  closeEditModal() { 
    this.resetEventForm();
    this.isEditModalOpen = false; 
  }

}
