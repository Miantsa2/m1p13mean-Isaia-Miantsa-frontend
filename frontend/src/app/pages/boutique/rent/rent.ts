import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { ChargeService } from '../../../services/charge';
import { Boutique } from '../../../services/boutique';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../../components/modal-form/modal-form';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './rent.html'
})
export class Rent {

  private chargeService = inject(ChargeService);
  private boutiqueService = inject(Boutique);
  boutiqueId?: string;
   
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
          eventColor: '#16a34a',
        };
      },
      error: (err) => console.error('Erreur chargement loyer', err)
    });
  }



}
