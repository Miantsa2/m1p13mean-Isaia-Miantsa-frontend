import { Component, effect,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { ChargeService } from '../../../services/charge';
import { FormsModule } from '@angular/forms';
import { Boutique } from '../../../services/boutique';

@Component({
  selector: 'app-charge',
   standalone: true,
  imports: [CommonModule, TableCorps, ButtonPrimaire, ModalForm, FormsModule],
  templateUrl: './charge.html',
})

export class Charge {
   eventColumns: TableColumn[] = [
    { key: 'reference', label: 'Charge Reference' },
    { key: 'description', label: 'Description' },
    { key: 'valeur', label: 'Value' },
    { key: 'date_limite', label: 'Final Date' },
    { key: 'du_centre', label: 'Owner' },
    { key: 'actions', label: 'Actions' },
  ];

  private boutiqueService = inject(Boutique);
  private chargeService = inject(ChargeService);


  isModalAddOpen = false;
  isEditModalOpen = false;

  selectedDuCentre: boolean | null = null;
  ordre: 'asc' | 'desc' = 'desc';

  charges: any[] = [];


  newCharge = {
    reference: '',
    description:'',
    valeur:  0,
    date_limite:'',
    boutique: '',
    du_centre: false,
    statut: 'paye'

  };

  currentEditingId= '';


  
  constructor() {
     effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      
      if (boutique && boutique._id) {
        console.log("Boutique chargée :", boutique._id);
        this.loadCharge(boutique._id);
      }
    });
    
  }

 loadCharge(boutiqueId: string): void {
  this.chargeService.getChargesByBoutiqueId(boutiqueId).subscribe({
    next: (data) => {
      this.charges = data.map((charge: any) => ({
        _id: charge._id,
        reference: charge.reference,
        description: charge.description,
        valeur: charge.valeur.toFixed(2), 
        du_centre: charge.du_centre,
        statut: charge.statut,
        date_limite: charge.date_limite
          ? new Date(charge.date_limite)
          : null,
        dateFormatted: charge.date_limite
          ? new Date(charge.date_limite).toLocaleString()
          : '—'
      }));

      console.log('Charges chargées:', this.charges);
    },
    error: (err) => {
      console.error('Erreur lors du chargement des charges', err);
    }
  });
}


  deleteCharge(id: string) {
    this.chargeService.deleteCharge(id).subscribe(() => {
        const bId = this.boutiqueService.currentBoutique()?._id;
        if(bId) this.loadCharge(bId);
    });
  }

  createCharge() {
    const bId = this.boutiqueService.currentBoutique()?._id;  
    if (bId) {
      this.newCharge.boutique = bId; 
       const payload = {
        ...this.newCharge,
        date_limite: new Date(this.newCharge.date_limite).toISOString(),
      };   
      this.chargeService.addCharge(payload).subscribe({
        next: () => {
          this.loadCharge(bId);
          this.closeCreateModal();
          this.resetChargeForm()
        },
        error: (err) => console.error('Erreur création charge', err)
      });
    }

  }


  updateCharge() {
   
    const payload = {
      ...this.newCharge,
      date_limite: new Date(this.newCharge.date_limite).toISOString(),
    };  
    this.chargeService.updateCharge(this.currentEditingId, payload).subscribe({
      next: () => {
        const bId = this.boutiqueService.currentBoutique()?._id;
        if (bId) this.loadCharge(bId);
        this.resetChargeForm();
        this.closeEditModal();
      },
      error: (err) => console.error('Update failed', err)
    });
  }

  
  isChargeFormInvalid(): boolean {
    if (!this.newCharge.reference || !this.newCharge.description || !this.newCharge.date_limite ) {
      return true; 
    }
    // const date_limite = new Date(this.newCharge.date_limite);

 
    // const maintenant = new Date();
    // if (!this.currentEditingId) {
    // if (date_limite > maintenant) {
    //   return true;
    // }
  // }

    return false; 
  }

  applyFilters() {
    const bId = this.boutiqueService.currentBoutique()?._id;
    this.chargeService.filterCharges({
      duCentre: this.selectedDuCentre,
      ordre: this.ordre,
      boutiqueId: bId
      
    }).subscribe({
      next: (data) => {
        this.charges = data.map(charge => ({
          ...charge,
          dateFormatted: new Date(charge.date_limite).toLocaleDateString()
        }));
      },
      error: (err) => {
        console.error('Erreur filtre charge', err);
      }
    });
  }






  openEditModal(charge: any) {
    console.log('Editing charge:', charge);
    this.newCharge = {
      reference: charge.reference,
      description: charge.description,
      valeur: charge.valeur,
      date_limite:this.chargeService.formatDateForInput(charge.date_limite),
      boutique: charge.boutique,
      du_centre: charge.du_centre,
      statut: charge.statut

    };
    this.currentEditingId= charge._id
    this.isEditModalOpen = true; 
    }


  closeEditModal() { 
    this.isEditModalOpen = false; 
  }
  openCreateModal() { this.isModalAddOpen = true; }



  resetChargeForm() {
   this.newCharge = {
    reference: '',
    description:'',
    valeur: 0,
    date_limite:'',
    boutique: '',
    du_centre: false,
     statut: 'paye' 
     };
  }

  closeCreateModal() {
    this.isModalAddOpen = false;
  }


}









  


