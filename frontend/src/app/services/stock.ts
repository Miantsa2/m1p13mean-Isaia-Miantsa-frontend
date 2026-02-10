import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockItem } from '../pages/boutique/stock/stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = `${environment.apiUrl}/mean/stock`;

  constructor(private http: HttpClient) {}

  getInventory(boutiqueId: string): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${this.apiUrl}/getInventory/${boutiqueId}`);
  }

  addMovement(produitId: string, quantite: number, est_entree: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addMovement`, { produitId, quantite, est_entree });
  }
}