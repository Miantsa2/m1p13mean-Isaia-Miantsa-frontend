import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { EvenementService } from '../../../services/evenement';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, ModalForm, FormsModule],
  templateUrl: './event.html',
})


export class Events implements OnInit {

  eventColumns: TableColumn[] = [
    { key: 'reference', label: 'Event Reference' },
    { key: 'description', label: 'Description' },
    { key: 'dateDebut', label: 'Start Date' },
    { key: 'dateFin', label: 'End Date' },
    { key: 'actions', label: 'Actions' }


  ];
  events: any[] = [];
  
  // Modal section
  isModalOpen = false;
  isPriceModalOpen = false;
  isEditModalOpen = false;
  isModalAssignOpen = false;
  
  filterOptions = {
    statut: 'all',
    order: 'desc'
  };

  newEvent = {
    reference: '',
    type: 'centre',
    statut: 'approuved',
    description:'',
    dateDebut:'',
    dateFin:''
  };

  currentEditingId= '';
  

  constructor(
    private evenementService: EvenementService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const params: any = { type : 'centre' };
    this.evenementService.getEventsByType(params).subscribe({
      next: (res) => {
        console.log(res);

        this.events = res.map((event: any) => ({
          _id: event._id,
          reference: event.reference,
          description: event.description,
          dateDebut: new Date(event.dateDebut),
          dateFin: new Date(event.dateFin),
          dateDebutFormatted: new Date(event.dateDebut).toLocaleString(),
          dateFinFormatted: new Date(event.dateFin).toLocaleString()
        }));
        console.log(this.events);

      },
      error: (err) => console.error(err)
    });
  }

  
  onFilterChange(): void {
    const params: any = { order: this.filterOptions.order };
     if (this.filterOptions.statut !== 'all') {
      params.statut = this.filterOptions.statut;
    }
    
    this.evenementService.filterCenterEvents(params).subscribe({
      next: (res) => {
        this.events = res.map((event: any) => ({
          _id: event._id,
          reference: event.reference,
          description: event.description,
          dateDebut: new Date(event.dateDebut),
          dateFin: new Date(event.dateFin),
          dateDebutFormatted: new Date(event.dateDebut).toLocaleString(),
          dateFinFormatted: new Date(event.dateFin).toLocaleString()

        }));
        console.log(this.events);
      },
      error: (err) => console.error(err)
    });
  }

  
 

  deleteEvent(id: string): void {
    this.evenementService.deleteEvent(id).subscribe(() =>
    this.loadEvents());
  }

  addEvent() {
    
    const payload = {
      ...this.newEvent,
      dateDebut: new Date(this.newEvent.dateDebut).toISOString(),
      dateFin: new Date(this.newEvent.dateFin).toISOString()
    };
    this.evenementService.addEvent(payload).subscribe({
      next: (res) => {
        console.log('Success event create!');
        this.loadEvents(); 
        this.resetEventForm();
        this.closeCreateModal();
      },
      error: (err) => alert(err.error.message)
    });
  }


  
  updateEvent() {
     const payload = {
      ...this.newEvent,
      dateDebut: new Date(this.newEvent.dateDebut).toISOString(),
      dateFin: new Date(this.newEvent.dateFin).toISOString()
    };
    this.evenementService.updateEvent(this.currentEditingId, payload).subscribe({
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
      type: 'centre',
      statut: 'approuved',
      description:'',
      dateDebut:'',
      dateFin:''
    };
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
    console.log(event.dateDebut);
    console.log(event.dateFin);


    this.newEvent = {
      reference: event.reference,
      type: event.type,
      statut: event.statut,
      description: event.description,
      dateDebut: this.formatDateForInput(event.dateDebut),
      dateFin: this.formatDateForInput(event.dateFin)
    };
    this.currentEditingId= event._id
    this.isEditModalOpen = true; 
    }
  closeEditModal() { 
    this.resetEventForm();
    this.isEditModalOpen = false; 
  }

}
