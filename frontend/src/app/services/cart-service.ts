import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiPanier = `${environment.apiUrl}/mean/cart`;
  private apiClient = `${environment.apiUrl}/mean/client`;

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
      this.http.get(`${this.apiPanier}/client/${clientId}`).subscribe({
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
    if (!clientId) return alert("You have to connect first!");

    this.http.post(`${this.apiPanier}/add`, {
      clientId,
      produitId,
      prix
    }).subscribe(() => this.refreshCart());
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
    if (clientId) {
      this.http.delete(`${this.apiPanier}/remove-product/${clientId}/${produitId}`)
        .subscribe(() => this.refreshCart());
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



  
}
