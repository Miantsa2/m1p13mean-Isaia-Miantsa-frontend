import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Boutique {
  private apiUrl = `${environment.apiUrl}/mean/boutique`;

  currentBoutique = signal<any>(null);

  constructor(private http: HttpClient) {}

  getBoutiques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getBoutiques`);
  }

  getBoutique() {
   return this.http.get<any>(`${this.apiUrl}/getBoutiqueByUser`);
  }

  loadCurrentBoutique() {
    this.http.get<any>(`${this.apiUrl}/getBoutiqueByUser`).subscribe({
      next: (data) => {
        this.currentBoutique.set(data);    
        console.log('Current boutique loaded:', data);
      },
      error: (err) => {
        console.error('Error loading boutique', err);
      }
    });
  }

  getBoutiquesById(id: String): Observable<any> {
    return this.http.get(`${this.apiUrl}/getBoutique/${id}`);
  }

  createBoutique(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createBoutique`, data);
  }

  updateBoutique(id: String, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateBoutique/${id}`, data);
  }

  
  addNotif(id: String, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateNotif/${id}`, data);
  }

  deleteBoutique(id: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteBoutique/${id}`);
  }


  // Dans boutique.service.ts
  markAllNotificationsAsRead(boutiqueId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/readNotif/${boutiqueId}/notifications/lue`, {});
  }

}