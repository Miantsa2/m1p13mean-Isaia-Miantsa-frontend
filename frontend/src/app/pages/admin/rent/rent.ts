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
    mois = new Date().getMonth() + 1;
  annee = new Date().getFullYear();
  errorMessage = '';
  

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true, 
    dateClick: (info) => {
      console.log("Clic détecté !");
      this.openAddModal(info.dateStr);
    },

    datesSet: (info: any) => {
      const currentViewDate = info.view.currentStart || info.start;
      this.mois = currentViewDate.getMonth() + 1;
      this.annee = currentViewDate.getFullYear();
      this.loadBoutiquesPayees(this.mois, this.annee);
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

  editingChargeId : string = '';

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
     this.chargeService.getLoyerByBoutiqueId(boutiqueId, mois, annee).subscribe({
      next: (charge: any) => {     
          if(charge) {
          this.editingChargeId = charge._id; 
        }
      },
      error: (err) => console.error('Erreur récupération charge', err)
    });
    }
    this.isAddModalOpen = true;
  }

  onBoutiqueChange(event: Event) {
    const boutiqueId = (event.target as HTMLSelectElement).value;
    this.paymentForm.boutique = boutiqueId;
    if (!boutiqueId) return;

    this.boutiqueService.getLoyerAdminPay(boutiqueId).subscribe({
      next: (res) => {
        this.paymentForm.valeur = res.loyer;
      },
      error: (err) => {
          this.errorMessage = err?.error?.message || "Une erreur est survenue";
      }
    });
  }



  closeAddModel() {
    this.isAddModalOpen = false;
    this.resertForm();
  }

  

  updateCharge(currentEditingId : string) {
    const newcharge = {
      statut: 'paye'
    };
   console.log('Updating charge with data:', newcharge);
    this.chargeService.updateCharge(currentEditingId, newcharge).subscribe({
      next: (updatedCharge : any) => {
          const notif = {
          titre: 'Rent Validation',
          description: `Your rent of ${updatedCharge.date_limite} has been paied`
        };

        this.boutiqueService.addNotif(updatedCharge.boutique, notif).subscribe({
          next: () => {
            console.log('Notification envoyée à la boutique');
             this.loadBoutiquesPayees(this.mois, this.annee);
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        }); 
      },
      error: (err) => console.error('Erreur update charge', err)

    });
  }



  
  createCharge() {
      console.log('Creating charge with data:', this.paymentForm);
      this.chargeService.addCharge(this.paymentForm).subscribe({
        next: (createdCharge : any) => {
          const notif = {
          titre: 'Rent Validation',
          description: `Your rent of ${createdCharge.date_limite} has been paied`
        };
        console.log('boutique', createdCharge.boutique);

        this.boutiqueService.addNotif(createdCharge.boutique, notif).subscribe({
          next: () => {
            console.log('Notification envoyée à la boutique');
             this.loadBoutiquesPayees(this.mois, this.annee);
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        });
        },
        error: (err) => console.error('Erreur création charge', err)
      });
  }

  confirmPayment() {
    if (this.editingChargeId !== '' && this.editingChargeId !== undefined) {
      this.updateCharge(this.editingChargeId); 
    } else {
      this.createCharge(); 
    }
     this.closeAddModel();
   }


   isFormInvalid(): boolean {
    
    const date_limite = new Date(this.paymentForm.date_limite);
    const maintenant = new Date();
    date_limite.setHours(0, 0, 0, 0);
    maintenant.setHours(0, 0, 0, 0);
    if(!this.paymentForm.boutique || !this.paymentForm.date_limite || this.paymentForm.valeur <= 0) {
      return true;
    }
    if (date_limite < maintenant) {
      return true;
    }

    return false; 
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
