import { Component, ViewChild, ElementRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { Header } from '../../../layout-client/header/header';
import { Footer } from '../../../layout-client/footer/footer';
import { CentreService } from '../../../services/centre';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../../services/cart-service';
import { Router } from '@angular/router';
import { Boutique } from '../../../services/boutique';

@Component({
  selector: 'app-invoice-cart',
   imports: [CommonModule,ButtonPrimaire, Footer, Header],
   standalone: true,
  templateUrl: './invoice-cart.html',
  styleUrl: './invoice-cart.css',
})
export class InvoiceCart {
  @ViewChild('invoiceContentRef') invoiceContent!: ElementRef<HTMLElement>;

  invoice = {
    produits: [] as Array<{
      produitId: string,
      nom: string,
      prixUnitaire: number,
      quantite: number,
      subtotal: number
    }>,
    totalPanier: 0,
    prixLivraison: 0,
    totalAPayer: 0,
    currency: 'eur',
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
  footerData: any = {};

        
  private key = environment.STRIPE_PUBLIC_KEY;

  constructor(
    private centreService: CentreService,
    private route: ActivatedRoute,
    public cartService: CartService,
    private router: Router,
    private boutiqueService: Boutique) {
  }

  private async initStripe() {
    this.stripe = await loadStripe(this.key);
    if (!this.stripe) {
      console.error("Impossible to charge Stripe");
      return;
    }

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card', { hidePostalCode: true });
    setTimeout(() => {
      this.card.mount('#card-element');
    }, 0);
  }

  ngOnInit() {
    this.loadCentreData();
    this.loadInvoice();
  
  }

  loadCentreData() {
    this.centreService.getCenter().subscribe({
      next: (data) => {
        const center = Array.isArray(data) ? data[0] : data;
        if (center) {
          this.footerData = {
            title: 'CONTACT',
            phone: center.telephone || '032 58 861 59',
            email: center.email || 'email@gmail.com',
            logoUrl: center.logo || '/image.png'
          };
        }
      },
      error: (err) => console.error('Error getting info :', err)
    });
  }

  async loadInvoice(){
    if (this.cartService.currentPanier()) {
      this.clientData.name = this.cartService.currentClient()?.nom + ' ' + this.cartService.currentClient()?.prenom;
      this.clientData.email = this.cartService.currentClient()?.user.email;

      this.cartService.makeInvoiceCart(this.cartService.currentPanier()._id).subscribe({
        next: (res) => {
          this.invoice = res;
          this.clientSecret = res.clientSecret;
          this.initStripe();

          
        },
        error: (err) => console.error('Invoice generation failed', err)
      });
    }
  }

  confirmCart() {
    const clientId = this.cartService.currentClient()?._id;
    if (!clientId) return;

    this.cartService.validateCart(clientId).subscribe({
      next: (res) => {
        this.cartService.currentPanier().produits.forEach((produit: any) => {
          console.log(produit);
           const notif = {
            titre: 'New Sale',
            description: ` Mr/Ms ${this.cartService.currentClient()?.nom} ordered a  ${produit.id.nom} `
          };

          this.boutiqueService.addNotif(produit.id.boutique._id, notif).subscribe({
            next: () => {
              console.log('Notification envoyée à la boutique');
            },
            error: (err) => {
              console.error('Erreur notification', err);
            }
          }); 
        });
         alert('Order confirmed!');
        this.cartService.refreshCart();
      },
      error: (err) => {
        console.error('Validation error:', err);
        alert('Error during validation');
      }
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
      alert("Payment successful !");
      this.confirmCart();
      this.router.navigate(['/home']);
    }
    this.resertForm();

  }

  resertForm() {
    this.invoice = {
      produits: [] as Array<{
        produitId: string,
        nom: string,
        prixUnitaire: number,
        quantite: number,
        subtotal: number
      }>,
      totalPanier: 0,
      prixLivraison: 0,
      totalAPayer: 0,
      currency: 'eur',
    };
  }
}