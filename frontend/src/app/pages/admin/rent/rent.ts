import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ChargeService } from '../../../services/charge';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { Boutique } from '../../../services/boutique';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../../components/modal-form/modal-form';
import { CentreService } from '../../../services/centre';




@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,FormsModule,ModalForm,CommonModule],
  templateUrl: './rent.html'
})
export class RentAdmin {
  constructor(private boutiqueService: Boutique, private chargeService: ChargeService) {}
  stores: any[] = [];

  

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true, 
    dateClick: (info) => {
      console.log("Clic détecté !");
      this.openAddModal(info.dateStr);
    },

    datesSet: (info: any) => {
      const mois = info.start.getMonth() + 1;
      const annee = info.start.getFullYear();
      this.loadBoutiquesPayees(mois, annee);
    }

    
  };

   loadBoutiquesPayees(mois: number, annee: number) {
    

    this.boutiqueService.getLoyersPayes(mois, annee).subscribe((events: any) => {
      this.calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: events, 
        eventColor: '#16a34a',
        dateClick: (info: any) => {
          this.openAddModal(info.dateStr);
        }
      };
      console.log('Loyers payés chargés :', events);
    });
  }
  

  isAddModalOpen = false;

 

  paymentForm = {
    reference:'',
    description:'',
    boutique: '',
    date_limite: '',
    valeur: 0,
    du_centre: true,
    statut: 'paye'
  };

  openAddModal(date: string, boutiqueId?: string) {
    this.paymentForm = {
      boutique: boutiqueId || '',
      date_limite: date,
      valeur: 0,
      statut: 'paye',
      du_centre: true,
      reference: 'RENT001',
      description: 'Rent of the month'

    };

    const dt = new Date(date);
    const mois = dt.getMonth() + 1;
    const annee = dt.getFullYear();

    this.boutiqueService.getBoutiquesByLoyer(mois, annee, 'paye').subscribe(data => {
      this.stores = data;
    });


    if (boutiqueId) {
      this.boutiqueService.getLoyer(boutiqueId).subscribe({
        next: (res) => {
          this.paymentForm.valeur = res.loyer;
        },
        error: (err) => console.error('Erreur calcul loyer', err)
      });
    }

    this.isAddModalOpen = true;
  }

  onBoutiqueChange(event: Event) {
    const boutiqueId = (event.target as HTMLSelectElement).value;
    if (!boutiqueId) return;

    this.boutiqueService.getLoyer(boutiqueId).subscribe(res => {
      this.paymentForm.valeur = res.loyer;
    });
  }



  closeAddModel() {
    this.isAddModalOpen = false;
    this.resertForm();
  }



  
  createCharge() {
      console.log('Creating charge with data:', this.paymentForm);
      this.chargeService.addCharge(this.paymentForm).subscribe({
        next: () => {
          const notif = {
          titre: 'Rent Validation',
          description: `Your rent of ${this.paymentForm.date_limite} has been paied`
        };

        this.boutiqueService.addNotif(this.paymentForm.boutique, notif).subscribe({
          next: () => {
            console.log('Notification envoyée à la boutique');
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        });
        this.closeAddModel();
        },
        error: (err) => console.error('Erreur création charge', err)
      });
    

  }

  resertForm() {
      this.paymentForm = {
      reference:'',
      description:'',
      boutique: '',
      date_limite: '',
      valeur: 0,
      du_centre: true,
      statut: 'paye'
    };
 }
}
