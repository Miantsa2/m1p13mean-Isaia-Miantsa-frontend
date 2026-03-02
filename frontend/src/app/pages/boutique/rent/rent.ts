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
import { environment } from '../../../../environments/environment';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { CentreService } from '../../../services/centre';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, ModalForm, ButtonPrimaire],
  templateUrl: './rent.html'
})
export class Rent {

  private chargeService = inject(ChargeService);
  private boutiqueService = inject(Boutique);
  boutiqueId?: string;
  centreId?: string;


  isPayModalOpen = false;

  paymentForm = {
    reference: '',
    description: '',
    boutique: this.boutiqueId,
    date_limite: '',
    valeur: 0,
    du_centre: true,
    statut: 'paye'
  };

  stripe!: Stripe | null;
  elements!: StripeElements;
  card: any;
  clientSecret: string = '';

  private key = environment.STRIPE_PUBLIC_KEY;

  constructor( private centreService: CentreService) {
    effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      if (boutique && boutique._id) {
        console.log("Boutique chargée :", boutique._id);
        this.boutiqueId = boutique._id;
        this.loadLoyer(boutique._id, new Date().getMonth() + 1, new Date().getFullYear());
      }
     
    });
  }

  currentCenter: any;
  currentCenterId: string = '';

    ngOnInit(): void {
      this.loadCentre();

    }


  loadCentre(): void {
    this.centreService.getCenter().subscribe({
      next: (res) => {
        this.currentCenter = res[0];
        this.currentCenterId = res[0]._id;
        console.log("Centre chargé :", this.currentCenter);
      }
    });
  }

  mois = new Date().getMonth() + 1;
  annee = new Date().getFullYear();
  isLoyerPaye = false; 


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    datesSet: (info: any) => {
       const currentViewDate = info.view.currentStart || info.start;
      this.mois = currentViewDate.getMonth() + 1;
      this.annee = currentViewDate.getFullYear();
      if (!this.boutiqueId) return;
      this.loadLoyer(this.boutiqueId, this.mois, this.annee);
    }  
  };

  loadLoyer(bId: string, mois: number, annee: number) {
    this.chargeService.getLoyerPayes(bId, mois, annee).subscribe({
      next: (events: any) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events,
        };
        console.log(this.isLoyerPaye);
        this.isLoyerPaye = events.some((e: any) => e.statut === 'paye');
        console.log(events);

      },

      error: (err) => console.error('Erreur chargement loyer', err)
    });
  }

  edditingChargeId : string = '';
  errorMessage : string = '';

  async openPayModal() {
    this.paymentForm = {
      boutique: this.boutiqueId || '',
      date_limite: `${this.annee}-${String(this.mois).padStart(2, '0')}-01`,
      valeur: 0,
      statut: '',
      du_centre: true,
      reference: 'RENT001',
      description: 'Rent of the month'
    };
    this.errorMessage='';

    if (this.boutiqueId) {
      this.boutiqueService.getLoyer(this.boutiqueId).subscribe({
        next: (res) => {
          this.paymentForm.valeur = res.loyer;
           this.clientSecret = res.clientSecret;
          this.initStripe(); // Initialisation Stripe après récupération du loyer
        },
        error: (err) => {
              this.errorMessage= err?.error?.message || "Une erreur est survenue";
            }
      });

      this.chargeService.getLoyerByBoutiqueId(this.boutiqueId, this.mois, this.annee).subscribe({
            next: (charge: any) => {     
               if(charge) {
                this.edditingChargeId = charge._id; 
              }
            },
            error: (err) => {
                alert(err?.error?.message || "Une erreur est survenue") ;
            }
          });

  
    }

    this.isPayModalOpen = true;
  }

  private async initStripe() {
    this.stripe = await loadStripe(this.key);
    if (!this.stripe) {
      console.error("Impossible de charger Stripe");
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', { hidePostalCode: true });
    setTimeout(() => {
      this.card.mount('#card-element');
    }, 0);


  }


   createCharge() {
      this.paymentForm.statut = 'paye'; 
      this.chargeService.addCharge(this.paymentForm).subscribe({
         next: () => {
          this.loadLoyer(this.boutiqueService.currentBoutique()?._id, this.mois, this.annee);

        const notif = {
          titre: 'Rent Payement',
          description: `Store  ${this.boutiqueService.currentBoutique()?.nom} has paid the rent ${this.paymentForm.date_limite}. `
        };  
        this.centreService.addNotif(this.currentCenterId, notif).subscribe({
          next: () => {
            console.log('Notification envoyée au centre');
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        }); 
      },
        error: (err) => console.error('Erreur création charge', err)
      });
    

  }


  updateCharge(currentEditingId : string) {
    const newcharge = {
      statut: 'paye'
    };
    this.chargeService.updateCharge(currentEditingId, newcharge).subscribe({
      next: () => {
        const notif = {
          titre: 'Rent Payement',
          description: `Store  ${this.boutiqueService.currentBoutique()?.nom} has paid the rent ${this.paymentForm.date_limite}. `
        };  
        this.centreService.addNotif(this.currentCenterId, notif).subscribe({
          next: () => {
            console.log('Notification envoyée au centre');
             this.loadLoyer(this.boutiqueService.currentBoutique()?._id, this.mois, this.annee);
          },
          error: (err) => {
            console.error('Erreur notification', err);
          }
        }); 
      },
      error: (err) => console.error('Erreur update charge', err)

    });
  }

  

  async confirmPayment() {
    if (!this.stripe || !this.card) return;

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card: this.card }
    });

    if (result.error) {
      const el = document.getElementById('card-errors');
      if (el) el.textContent = result.error.message!;
    } 
    else if (result.paymentIntent?.status === 'succeeded') {
      alert("Paiement réussi !");
        if (this.boutiqueId) {    
            if (this.edditingChargeId !== '' && this.edditingChargeId !== undefined) {
              this.updateCharge(this.edditingChargeId); 
            } else {
              this.createCharge(); 
            }
      
        }
      this.closePayModel();
    }
  }

   isFormInvalid(): boolean {
    if(!this.paymentForm.boutique || !this.paymentForm.date_limite || this.paymentForm.valeur <= 0) {
      return true;
    }

    return false; 
  }

  resertForm() {
    this.paymentForm = {
      reference: '',
      description: '',
      boutique: '',
      date_limite: '',
      valeur: 0,
      du_centre: true,
      statut: ''
    };
  }

  closePayModel() {
    this.isPayModalOpen = false;
    this.resertForm();
  }

}
