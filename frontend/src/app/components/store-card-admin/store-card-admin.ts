import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalForm } from '../modal-form/modal-form';
@Component({
  selector: 'app-store-card-admin',
  standalone: true,
  imports: [CommonModule, ModalForm],
  templateUrl: './store-card-admin.html',
})
export class StoreCardAdmin {
  @Input() logo: string = '';
  @Input() name: string = '';
  @Input() salle_ref: string = '';
  @Input() metre_carre: string = '';

  isModalEditOpen = false;
  openEditModal() { this.isModalEditOpen = true; }
  closeEditModal() { this.isModalEditOpen = false; }
}