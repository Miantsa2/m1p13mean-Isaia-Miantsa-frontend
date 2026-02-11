
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChargeService
 {
  private apiUrl = `${environment.apiUrl}/mean/charge`;

  constructor(private http: HttpClient) {}

  addCharge(charge: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createCharge`, charge);
  }

  updateCharge(id: string, charge:  any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateCharge/${id}`, charge);
  }


  deleteCharge(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteCharge/${id}`);
  }



  getChargesByBoutiqueId(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getChargeByBoutiqueId/${boutiqueId}`);
  }

  filterCharges(filters: {
    duCentre?: boolean | null;
    ordre?: 'asc' | 'desc';
    mois?: number | null;
    annee?: number | null;
    boutiqueId?: ''}): Observable<any[]> {

    let params = new HttpParams();

    if (filters.duCentre !== null && filters.duCentre !== undefined) {
      params = params.set('duCentre', filters.duCentre.toString());
    }

    if (filters.ordre) {
      params = params.set('ordre', filters.ordre);
    }

    if (filters.mois && filters.annee) {
      params = params.set('mois', filters.mois.toString());
      params = params.set('annee', filters.annee.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/filterCharge`, { params });
  }


  formatDateForInput(dateInput: string | Date): string {
    if (!dateInput) return '';

    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';

    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }


  getLoyerPayes(boutiqueId: string, mois: number, annee: number): Observable<any> {
    const params = new HttpParams()
      .set('mois', mois.toString())
      .set('annee', annee.toString());

    return this.http.get<any>(`${this.apiUrl}/isloyerpaye/${boutiqueId}`, { params });
  }



}