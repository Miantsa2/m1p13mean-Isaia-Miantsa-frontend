import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Produit {
  private apiUrl = `${environment.apiUrl}/mean/produit`;

  constructor(private http: HttpClient) {}

  getProduitsByBoutique(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/getProduitsByBoutique/${id}`);
  }
  
  getCategoriesByBoutique(id: string) {
    return this.http.get<any[]>(`${this.apiUrl}/getCategoriesByBoutique/${id}`);
  }

  createProduit(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createProduit`, data);
  }
  
  deleteProduit(id: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteProduit/${id}`);
  }

  updateProduit(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateProduit/${id}`, data);
  }

  toggleAvailability(produitId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateAvailability/${produitId}`, {});
  }
  }
