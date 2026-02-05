import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, ModalForm],
  templateUrl: './rooms.html',
})
export class Rooms {
  roomColumns: TableColumn[] = [
    { key: 'reference', label: 'Room Reference' },
    { key: 'size', label: 'Size in m²' },
    { key: 'date', label: 'Completion date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  // Données de test
  rooms = [
    { ref: 'RM001', size: 10, date: '01-12-2025', status: 'Occupied' },
    { ref: 'RM002', size: 25, date: '15-01-2026', status: 'Occupied' },
    { ref: 'RM003', size: 15, date: '14-02-2026', status: 'Free' },
  ];

  // Modal section
  isModalOpen = false;
  isPriceModalOpen = false;

  openCreateModal() { this.isModalOpen = true; }
  closeCreateModal() { this.isModalOpen = false; }

  openPriceModal() { this.isPriceModalOpen = true; }
  closePriceModal() { this.isPriceModalOpen = false; }
}