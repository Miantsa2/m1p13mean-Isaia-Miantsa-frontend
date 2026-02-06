import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalForm } from '../modal-form/modal-form';
import { Boutique } from '../../services/boutique';
import { SalleService } from '../../services/salle';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-store-card-admin',
  standalone: true,
  imports: [CommonModule, ModalForm, FormsModule],
  templateUrl: './store-card-admin.html',
})
export class StoreCardAdmin {
  @Input() boutiqueId!: string;
  @Input() logo: string = '';
  @Input() name: string = '';
  @Input() salle_ref?: string;
  @Input() metre_carre?: number;
  @Output() deleted = new EventEmitter<void>();

  boutique: any;
  salles: any[] = [];
  selectedSalleId!: string;

  constructor(private boutiqueService: Boutique, private salleService: SalleService, private router: Router) {}

  ngOnInit() {
    this.loadBoutique();
  }

  goToProducts() {
    this.router.navigate(['/layout-admin/stores/stores-products', this.boutiqueId]);
  }

  deleteOneBoutique() {
    if (!confirm('Are you sure you want to delete this store?')) return;

    this.boutiqueService.deleteBoutique(this.boutiqueId).subscribe({
      next: () => {
        this.deleted.emit();
      },
      error: err => console.error(err)
    });
  }

  loadBoutique() {
    this.boutiqueService.getBoutiquesById(this.boutiqueId)
      .subscribe((data) => {
        this.boutique = data;
        this.salle_ref = data.salle?.reference || '';
        this.metre_carre = data.salle?.tailleMetreCarre || 0;
      });
  }

  // Modal logic
  isModalEditOpen = false;

  openEditModal() { 
    this.isModalEditOpen = true; 
    this.salleService.getFreeRoom().subscribe((data) => {
      this.salles = data;

      //Add the actual room if there is any other free rooms
      if(this.boutique.salle) {
        const exists = this.salles.find(s => s._id === this.boutique.salle._id);
        if(!exists) this.salles.unshift(this.boutique.salle);

        this.selectedSalleId = this.boutique.salle._id;
      }
    });
  }

  updateBoutiqueSalle() {
    if(!this.selectedSalleId) return;

    this.boutiqueService.updateBoutique(this.boutique._id, { salle: this.selectedSalleId})
      .subscribe((updatedBoutique) => {
        this.boutique = updatedBoutique;
        this.salle_ref = updatedBoutique.salle?.reference || '';
        this.metre_carre = updatedBoutique.salle?.tailleMetreCarre || 0;

        this.closeEditModal();
      });
  }

  closeEditModal() { this.isModalEditOpen = false; }
}