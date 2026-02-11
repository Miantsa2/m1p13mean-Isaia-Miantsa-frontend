import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { ChargeService } from '../../../services/charge';
import { Boutique } from '../../../services/boutique';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { Payment } from '../../../services/payment';
@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './rent.html'
})
export class Rent {

  private chargeService = inject(ChargeService);
  private boutiqueService = inject(Boutique);
  private paymentService = inject(Payment);
  boutiqueId?: string;

  isAddModalOpen = false;

  paymentForm = {
    reference:'',
    description:'',
    boutique: this.boutiqueId,
    date_limite: '',
    valeur: 0,
    du_centre: true,
    statut: 'paye'
  };


   
  constructor() {
     effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      
      if (boutique && boutique._id) {
        console.log("Boutique chargée :", boutique._id);
        this.boutiqueId = boutique._id;
        this.loadLoyer(boutique._id,new Date().getMonth() + 1, new Date().getFullYear());
      }
    });
    
  }
  

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    datesSet: (info: any) => {
      const mois = info.start.getMonth() + 1;
      const annee = info.start.getFullYear();
      if (!this.boutiqueId) return;
      this.loadLoyer(this.boutiqueId,mois, annee);
    }  
  
  };



  loadLoyer(bId: string,mois: number, annee: number) {
    this.chargeService.getLoyerPayes(bId, mois, annee).subscribe({
      next: (events: any) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events, 
        };
      },
      error: (err) => console.error('Erreur chargement loyer', err)
    });
  }

    openAddModal() {
      this.paymentForm = {
        boutique: this.boutiqueId || '',
        date_limite: '',
        valeur: 0,
        statut: '',
        du_centre: true,
        reference: 'RENT001',
        description: 'Rent of the month'

      };


    if (this.boutiqueId) {
      this.boutiqueService.getLoyer(this.boutiqueId).subscribe({
        next: (res) => {
          this.paymentForm.valeur = res.loyer;
        },
        error: (err) => console.error('Erreur calcul loyer', err)
      });
    }

    this.isAddModalOpen = true;
  }

    resertForm() {
      this.paymentForm = {
      reference:'',
      description:'',
      boutique: '',
      date_limite: '',
      valeur: 0,
      du_centre: true,
      statut: ''
    };
 }

  closeAddModel() {
    this.isAddModalOpen = false;
    this.resertForm();
  }








}
