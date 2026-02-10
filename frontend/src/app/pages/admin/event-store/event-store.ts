
import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { EvenementService } from '../../../services/evenement';
import { FormsModule } from '@angular/forms';
import { Boutique } from '../../../services/boutique';




@Component({
  selector: 'app-event-store',
  standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, FormsModule],
  templateUrl: './event-store.html',
})


export class EventStore implements OnInit {

  eventColumns: TableColumn[] = [
    { key: 'reference', label: 'Event Reference' },
    { key: 'description', label: 'Description' },
    { key: 'statut', label: 'Status' },
    { key: 'boutique', label: 'Stores' },
    { key: 'dateDebut', label: 'Start Date' },
    { key: 'dateFin', label: 'End Date' },
    { key: 'actions', label: 'Actions' }


  ];
  eventStores: any[] = [];
  newEventStore = {
    statut: ''
  };
  
  // Modal section
  isModalOpen = false;
  isPriceModalOpen = false;
  isEditModalOpen = false;
  isModalAssignOpen = false;
  
  filterOptions = {
    statut: 'all',
    ordre: 'desc',
    boutiqueId: 'all'
  };

  stores: any[] = [];

  currentEditingId= '';
  

  constructor(
    private evenementService: EvenementService,
    private boutiqueService: Boutique
  ) {}

  ngOnInit(): void {
    this.loadEventStores();
    this.loadStores();
  }

  loadStores(): void {
    this.boutiqueService.getBoutiques().subscribe({
      next: data => this.stores = data,
      error: err => console.error(err)
    });
  }

  loadEventStores(): void {
  this.evenementService.getEventsByType('boutique').subscribe({
    next: (res) => {
      console.log(res);
      this.eventStores = res.map((event: any) => ({
        _id: event._id,
        reference: event.reference,
        description: event.description,
        statut: event.statut,
        boutique: event.boutique,
        dateDebut: new Date(event.dateDebut).toLocaleString(),
        dateFin: new Date(event.dateFin).toLocaleString(),
      }));
    },
    error: (err) => console.error(err)
  });
}

statutFormatted (statut : string): string {
  switch (statut) {
    case 'en_attente': return 'In Progress';
    case 'termine': return 'Finished';
    case 'valide': return 'Accepted';
    case 'refuse': return 'Refused';
    default: return statut; 
  }
}

  onFilterChange(): void {
    const params: any = { ordre: this.filterOptions.ordre };
     if (this.filterOptions.statut !== 'all') {
      params.statut = this.filterOptions.statut;
    }

   if (this.filterOptions.boutiqueId !== 'all') {
      params.boutiqueId = this.filterOptions.boutiqueId;
    }
    
    this.evenementService.filterStoreEvents(params).subscribe({
      next: (res) => {
         this.eventStores = res.map((event: any) => ({
          _id: event._id,
          reference: event.reference,
          description: event.description,
          statut: event.statut,
          boutique: event.boutique,
          dateDebut: new Date(event.dateDebut).toLocaleString(),
          dateFin: new Date(event.dateFin).toLocaleString(),
        }));
        console.log(this.eventStores);
      },
      error: (err) => console.error(err)
    });
  }

  
 

 updateEventStore(eventId: string,nouveauStatut: string,storeId: string,eventReference: string): void {
    const updateData = { statut: nouveauStatut };

    this.evenementService.updateEvent(eventId, updateData).subscribe({
      next: () => {

        const notif = {
          titre: 'Event Request',
          description: `The event ${eventReference} has been ${nouveauStatut}`
        };

        this.boutiqueService.addNotif(storeId, notif).subscribe({
          next: () => {
            console.log('Notification envoyée à la boutique');
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        });

        console.log(`Statut mis à jour : ${nouveauStatut}`);
        this.loadEventStores();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du statut", err);
      }
    });
  }


   acceptEvent(eventId: string) {
      this.evenementService.acceptEvent(eventId).subscribe({
        next: (res) => {
          this.loadEventStores();
          console.log(`Event ${eventId} approuved`);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }


}
