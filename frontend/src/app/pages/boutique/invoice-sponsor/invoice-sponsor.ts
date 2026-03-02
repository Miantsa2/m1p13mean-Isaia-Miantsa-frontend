import { Component,OnInit, Input, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Boutique } from '../../../services/boutique';
import { ChargeService } from '../../../services/charge';
import { Produit } from '../../../services/produit';
import { CentreService } from '../../../services/centre';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



@Component({
  selector: 'app-invoice-sponsor',
  imports: [CommonModule,ButtonPrimaire],
   standalone: true,
  templateUrl: './invoice-sponsor.html',
  styleUrl: './invoice-sponsor.css',
})
export class InvoiceSponsor {

  invoice={
    produitId: '',
    produitNom: '',
    produitPrix: 0,
    dateDebut: '',
    dateFin: '',
    duree: '',
    currency: '',
    amount: 0,
  }

   
  newCharge = {
    reference: 'SPONSOR002',
    description:'sponsor',
    valeur:  0,
    date_limite:'',
    boutique: '',
    du_centre: true,
    statut: 'paye'

  };

  
 

  
    clientData = {
        name: '',
        email: '', 
      };
      
    creationDate: string = new Date().toISOString().split('T')[0];
   

        
    stripe!: Stripe | null;
    elements!: StripeElements;
    card: any;
    clientSecret: string = '';

        
    private key = environment.STRIPE_PUBLIC_KEY;
    selectedProduct: any = null;
    sponsorData: any;

    constructor(
      private router: Router,
      private boutiqueService: Boutique,
      private chargeService: ChargeService,
      private produitService: Produit,
      private centreService: CentreService,
    ) {

      const state = history.state;

        this.selectedProduct = state.produit;
        this.sponsorData = state.sponsorData;
  }


     

   currentCenter: any;
  currentCenterId: string = '';


    
   
  ngOnInit() {
    this.loadInvoice();
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

  createCharge() {
    const bId = this.boutiqueService.currentBoutique()?._id;  
    if (bId) {

      this.newCharge.boutique = bId;  
      console.log('Creating charge with data:', this.newCharge);
      this.chargeService.addCharge(this.newCharge).subscribe({
        next: () => {
        },
        error: (err) => console.error('Erreur création charge', err)
      });
    }

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



  async loadInvoice(){
    if (this.selectedProduct) {
     
      this.produitService.makeInvoice(this.selectedProduct._id, this.sponsorData).subscribe({
        next: (res) => {
          this.invoice = res.invoice;
          this.clientSecret = res.clientSecret;
          this.newCharge.valeur= res.invoice.amount;
          this.newCharge.date_limite=res.invoice.dateFin;
          this.clientData.name= this.boutiqueService.currentBoutique()?.nom;
          this.clientData.email=this.boutiqueService.currentBoutique()?.user.email;
          this.initStripe();

          
        },
        error: (err) => console.error('Invoice generation failed', err)
      });
    }
  }


    onUpdateSponsor() {
    if (this.selectedProduct) {
      const body = {
      sponsor: {
        dateDebut: this.sponsorData.dateDebut,
        dateFin: this.sponsorData.dateFin
      }
    };
      this.produitService.updateProduit(this.selectedProduct._id, body).subscribe({
        next: () => {
          const notif = {
            titre: 'Sponsor Payement',
            description: `Store  ${this.boutiqueService.currentBoutique()?.nom} has paid a sponsor for ${this.selectedProduct.reference}. `
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

        error: (err) => console.error('Update failed', err)
      });
    }
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
      this.onUpdateSponsor();
      this.createCharge();
      this.router.navigate(['/layout-boutique/products']);
       
    }
    this.resertForm();

  }

  resertForm() {
    this.invoice={
      produitId: '',
      produitNom: '',
      produitPrix: 0,
      dateDebut: '',
      dateFin: '',
      duree: '',
      currency: '',
      amount: 0,
  
    };
  }





  
  async downloadPDF() {
    const element = document.getElementById('invoice-content');
      if (!element) {
      console.error("Invoice not found");
      return;
    }

    // Capture avec html2canvas
    const canvas = await html2canvas(element , {
      scale: 2,           
      useCORS: true,
      backgroundColor: '#ffffff',
      ignoreElements: (el) => el.classList.contains('no-pdf')
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4'); // format A4 portrait

    const pdfWidth = 180; // largeur du contenu dans PDF en mm (210 max pour A4 avec marge)
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 15, 15, pdfWidth, pdfHeight); // 15 mm de marge
    pdf.save('invoice.pdf');
  }


 


}







