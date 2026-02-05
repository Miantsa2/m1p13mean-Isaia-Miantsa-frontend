import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { SalleService } from '../../../services/salle';
import { CentreService } from '../../../services/centre';
import { FormsModule } from '@angular/forms';





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

  rooms: any[] = []; 

  meterPrice: number = 0;


  

  // Modal section
  isModalOpen = false;
  isPriceModalOpen = false;

  constructor(private salleService: SalleService, private centreService: CentreService ) {}



  ngOnInit(): void {
    this.loadRooms();
    this.loadCentre();
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
        console.log('Meter price loaded:', res);
        //this.cdr.detectChanges();
      },
      
      error: (err) => {
        console.error('Error loading meterPrice:', err);
      }
    });
  }

  // Objet pour stocker les choix actuels
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

 addRoom() {
  this.salleService.addRoom(this.newRoom).subscribe({
    next: (res) => {
      console.log('Success!');
      this.loadRooms(); // Rafraîchir la liste
      //this.isModalOpen = false; // Fermer la modal ici
    },
    error: (err) => console.error('Erreur lors de la création', err)
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
        ////this.cdr.detectChanges();
      }
    });
  }
  


  openCreateModal() { this.isModalOpen = true; }
  closeCreateModal() { this.isModalOpen = false; }

  openPriceModal() { this.isPriceModalOpen = true; }
  closePriceModal() { this.isPriceModalOpen = false; }
}
