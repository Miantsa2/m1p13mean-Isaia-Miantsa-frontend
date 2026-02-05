import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { SalleService } from '../../../services/salle';



@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, ModalForm],
  templateUrl: './rooms.html',
})
export class Rooms implements OnInit {

  roomColumns: TableColumn[] = [
    { key: 'reference', label: 'Room Reference' },
    { key: 'tailleMetreCarre', label: 'Size in m²' },
    { key: 'createdAt', label: 'Completion date' },
    { key: 'statut', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  rooms: any[] = []; 
  meterPrice: number = 0;

  // Modal section
  isModalOpen = false;
  isPriceModalOpen = false;

  constructor(private salleService: SalleService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.salleService.getRoom().subscribe({
      next: (res) => {
        this.rooms = res.map((room: any) => ({
          _id: room._id,
          reference: room._id,
          size: room.tailleMetreCarre,
          date: new Date(room.createdAt).toLocaleDateString(),
          status: room.statut === 'libre' ? 'Free' : 'Occupied'
        }));
        console.log(this.rooms);

      },
      error: (err) => console.error(err)
    });
  }


  openCreateModal() { this.isModalOpen = true; }
  closeCreateModal() { this.isModalOpen = false; }

  openPriceModal() { this.isPriceModalOpen = true; }
  closePriceModal() { this.isPriceModalOpen = false; }
}
