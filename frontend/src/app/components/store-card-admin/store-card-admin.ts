import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalForm } from '../modal-form/modal-form';
import { Boutique } from '../../services/boutique';
@Component({
  selector: 'app-store-card-admin',
  standalone: true,
  imports: [CommonModule, ModalForm],
  templateUrl: './store-card-admin.html',
})
export class StoreCardAdmin {
  @Input() boutiqueId!: string;
  @Input() logo: string = '';
  @Input() name: string = '';
  @Input() salle_ref?: string;
  @Input() metre_carre?: number;
  @Output() deleted = new EventEmitter<void>();

  constructor(private boutiqueService: Boutique) {}

  deleteOneBoutique() {
    if (!confirm('Are you sure you want to delete this store?')) return;

    this.boutiqueService.deleteBoutique(this.boutiqueId).subscribe({
      next: () => {
        this.deleted.emit();
      },
      error: err => console.error(err)
    });
  }


  isModalEditOpen = false;
  openEditModal() { this.isModalEditOpen = true; }
  closeEditModal() { this.isModalEditOpen = false; }
}