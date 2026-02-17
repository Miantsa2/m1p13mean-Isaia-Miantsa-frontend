import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoutiqueStatService {
  private apiUrl = `${environment.apiUrl}/mean/dash_boutique`;

  constructor(private http: HttpClient) {}

  getVentesAnnuelles(boutiqueId: string, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventes-annuelles/${boutiqueId}?year=${year}`);
  }

  getTopProduits(boutiqueId: string, mois?: number, year?: number): Observable<any[]> {
    let params = `?year=${year || 2026}`;
    if (mois) params += `&mois=${mois}`;
    
    return this.http.get<any[]>(`${this.apiUrl}/top-produits/${boutiqueId}${params}`);
  }

  getStatsClients(boutiqueId: string, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/depense-moyenne-clients/${boutiqueId}?year=${year}`);
  }
}
