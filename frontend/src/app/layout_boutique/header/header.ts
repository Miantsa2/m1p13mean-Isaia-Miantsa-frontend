import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../components/modal-form/modal-form';
import { Boutique } from '../../services/boutique';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ModalForm, FormsModule, CommonModule],
  templateUrl: './header.html',
})
export class Header {
  @Output() onToggle = new EventEmitter<void>();
  
  boutiqueService = inject(Boutique);

  // Modal section
  isModalOpen = false;
  storeData: any = {};

  openSettings() {
    const boutique = this.boutiqueService.currentBoutique();
    if (boutique) {
      this.storeData = {
        name: boutique.nom,
        email: boutique.user?.email,
        phone: boutique.telephone,
        room: boutique.salle?.reference || 'N/A',
        category: boutique.categorie?.nom || 'N/A',
        horaires: boutique.horaires && boutique.horaires.length > 0 
                   ? [...boutique.horaires] 
                   : [{ jour: '', ouverture: '', fermeture: '' }],
        logo: boutique.logo,
        createdAt: boutique.createdAt
      }
    }
    this.isModalOpen = true;
  }

  closeSettings() {
    this.isModalOpen = false;
  }

  // Pour voir si un champ a été modifié
  isDirty(field: string): boolean {
    const original = this.boutiqueService.currentBoutique();
    if(!original) return false;

    switch (field) {
      case 'name': return this.storeData.name !== original.nom;
      case 'phone': return this.storeData.phone !== original.telephone;
      case 'category': return this.storeData.category !== original.categorie?.nom;
      case 'email': return this.storeData.email !== original.user?.email;
      default: return false;
    }
  }

  // pour les horaires qui ne marche pas encore
  isHorairesDirty(): boolean {
    const original = this.boutiqueService.currentBoutique()?.horaires || [];
    return JSON.stringify(this.storeData.horaires) !== JSON.stringify(original);
  }

  // save the changes
  saveChanges() {
    const id = this.boutiqueService.currentBoutique()?._id;
    const updatePayload = {
      nom: this.storeData.name,
      telephone: this.storeData.phone,
      horaires: this.storeData.horaires,
    };

    this.boutiqueService.updateBoutique(id, updatePayload).subscribe({
      next: (res) => {
        this.boutiqueService.loadCurrentBoutique();
        this.closeSettings();
      },
      error: (err) => console.error(err)
    });
  }

  emitToggle() {
    this.onToggle.emit();
  }
}
