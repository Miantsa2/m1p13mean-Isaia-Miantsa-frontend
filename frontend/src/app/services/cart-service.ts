import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiPanier = `${environment.apiUrl}/mean/cart`;
  private apiClient = `${environment.apiUrl}/mean/client`;
  private router = inject(Router);

  cartCount = signal<number>(0);
  currentPanier = signal<any>(null);
  currentClient = signal<any>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.initCartSystem();
  }

  initCartSystem() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      // On cherche le client lié à cet utilisateur
      this.http.get(`${this.apiClient}/user/${userId}`).subscribe({
        next: (client: any) => {
          this.currentClient.set(client);
          this.refreshCart();
        },
        error: (err) => console.error("Profil client introuvable", err)
      });
    }
  }

  refreshCart() {
    const clientId = this.currentClient()?._id;
    if (clientId) {
      this.http.get(`${this.apiPanier}/my-cart/${clientId}`).subscribe({
        next: (panier: any) => {
          this.currentPanier.set(panier);
          const count = panier?.produits?.reduce((acc: number, p: any) => acc + p.quantite, 0) || 0;
          this.cartCount.set(count);
        },
        error: (err) => {
          console.log("Panier vide ou non créé");
          this.currentPanier.set({ produits: [], total: 0 });
        }
      });
    }
  }

  addToCart(produitId: string, prix: number) {
    const clientId = this.currentClient()?._id;
    if (!clientId) {
      alert("You must be logged in to add products to your cart.");
      this.router.navigate(['/login']);
      return; 
    }

    this.http.post(`${this.apiPanier}/add`, {
      clientId,
      produitId,
      prix
    }).subscribe({
      next: () => {
        this.refreshCart();
      },
      error: (err) => {
        if (err.status === 400) {
          alert(err.error.message || "Insufficient stock!");
        } else {
          console.error("Error adding to cart", err);
        }
      }
    });
  }

  updateQuantity(produitId: string, nouvelleQuantite: number, prix: number) {
    const clientId = this.currentClient()?._id;
    if (!clientId || nouvelleQuantite < 1) return;

    this.http.get<{availableQty: number}>(`${this.apiPanier}/check-stock/${produitId}`).subscribe({
        next: (res) => {
            if (nouvelleQuantite > res.availableQty) {
                alert(`Sorry, only ${res.availableQty} items are available in stock.`);
            } else {
                this.http.put(`${this.apiPanier}/update-quantity`, {
                    clientId,
                    produitId,
                    nouvelleQuantite,
                    prix
                }).subscribe(() => this.refreshCart());
            }
        },
        error: (err) => console.error("Could not verify stock", err)
    });
  }

 
  removeProduct(produitId: string) {
    const clientId = this.currentClient()?._id;
    if (!clientId) return;

    if (confirm("Are you sure you want to remove this item?")) {
      this.http.delete(`${this.apiPanier}/remove-product/${clientId}/${produitId}`)
        .subscribe({
          next: () => {
            this.refreshCart(); 
          },
          error: (err) => console.error("Error removing product", err)
        });
    }
  }

  clearCart() {
    const clientId = this.currentClient()?._id;
    if (clientId && confirm("You are about to delete this cart")) {
      this.http.delete(`${this.apiPanier}/clear/${clientId}`).subscribe(() => {
        this.currentPanier.set(null);
        this.cartCount.set(0);
      });
    }
  }

  validateCart(clientId: string): Observable<any> {
    return this.http.post(`${this.apiPanier}/validate`, { clientId });
  }

  setRecuperation(panierId: string, lat: number, lng: number) {
    return this.http.put(`${this.apiPanier}/set-recuperation/${panierId}`, {
      coo_x: lat,
      coo_y: lng
    });
  }

  makeInvoiceCart(panierId: string): Observable<any> {
    return this.http.get<any>(`${this.apiPanier}/makeInvoice/cart/${panierId}`);
  } 

  getSalesByBoutique(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPanier}/boutique/${boutiqueId}`);
  }

  updateRecuperationDate(panierId: string, produitId: string, date: string) : Observable<any> {
    return this.http.put(`${this.apiPanier}/update-delivery/${panierId}/${produitId}`, { 
      date_recuperation: date 
    });
  }

  checkProductInPanier(panierId: string, produitId: string) {
    return this.http.patch(`${this.apiPanier}/check-item/${panierId}/${produitId}`, {});
  }

  getDeliveryHistory(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPanier}/client/${clientId}`);
  }

   getDeliveryPlace(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiPanier}/panier/${clientId}`);
  }
}