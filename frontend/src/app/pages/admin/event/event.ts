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
    ordre: 'desc'
  };

  newEvent = {
    reference: '',
    type: 'centre',
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
          dateDebut: new Date(event.dateDebut).toLocaleString(),
          dateFin: new Date(event.dateFin).toLocaleString(),
        }));
        console.log(this.events);

      },
      error: (err) => console.error(err)
    });
  }

  
  onFilterChange(): void {
    const params: any = { ordre: this.filterOptions.ordre };
     if (this.filterOptions.statut !== 'all') {
      params.statut = this.filterOptions.statut;
    }
    
    this.evenementService.filterCenterEvents(params).subscribe({
      next: (res) => {
        this.events = res.map((event: any) => ({
          _id: event._id,
          reference: event.reference,
          description: event.description,
          dateDebut: new Date(event.dateDebut).toLocaleString(),
          dateFin: new Date(event.dateFin).toLocaleString(),

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
    this.evenementService.addEvent(this.newEvent).subscribe({
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
        type: 'centre',
        description:'',
        dateDebut:'',
        dateFin:''
        
      };
  }


 
  openCreateModal() { this.isModalOpen = true; }
  closeCreateModal() { this.isModalOpen = false; }

  openPriceModal() { this.isPriceModalOpen = true; }
  closePriceModal() { this.isPriceModalOpen = false; }

  formatDateForInput(dateInput: any): string {
    if (!dateInput) return '';
    
    const d = new Date(dateInput);
        if (isNaN(d.getTime())) return '';

    const pad = (n: number) => n < 10 ? '0' + n : n;

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
      description: event.description,
      dateDebut: this.formatDateForInput(event.dateDebut),
      dateFin: this.formatDateForInput(event.dateFin)
    };
    this.currentEditingId= event._id
    this.isEditModalOpen = true; 
    }
  closeEditModal() { this.isEditModalOpen = false; }

}
