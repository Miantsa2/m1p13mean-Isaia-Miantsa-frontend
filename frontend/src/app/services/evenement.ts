import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = `${environment.apiUrl}/mean/event`;

  constructor(private http: HttpClient) {}

  addEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createEvent`, event);
  }

  updateEvent(id: string, event:  any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateEvent/${id}`, event);
  }

  
  acceptEvent(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/acceptEvent/${id}`, event);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteEvent/${id}`);
  }


  getEventsByType(type?: string): Observable<any[]> {
    let params = new HttpParams(); 
    
    if (type) {
      params = params.set('type', type); 
      console.log('Type parameter set to:', type);
    }
    console.log('Final query parameters:', this.http.get<any[]>(`${this.apiUrl}/getEvent`, { params }));
    return this.http.get<any[]>(`${this.apiUrl}/getEvent`, { params });
  }

   getApprouvedEventsByBoutiqueId(boutiqueId: string, statut?: string): Observable<any[]> {
    let params = new HttpParams(); 
    
    if (statut) {
      params = params.set('statut', statut); 
    }
    return this.http.get<any[]>(`${this.apiUrl}/getEventByBoutiqueIdandStatut/${boutiqueId}`, { params });
  }




  getEventsByBoutiqueId(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEventByBoutiqueId/${boutiqueId}`);
  }

  getEventsBystatut(statut: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getEventByStatut/${statut}`);
  }

  filterStoreEvents(filters: { boutiqueId?: string, statut?: string, ordre?: 'asc' | 'desc' }): Observable<any[]> {
      let params = new HttpParams();
      
      if (filters.boutiqueId) {
          params = params.set('boutiqueId', filters.boutiqueId);
      }
      
      if (filters.statut && filters.statut !== 'all') {
          params = params.set('statut', filters.statut);
      }
      
      if (filters.ordre) {
          params = params.set('order', filters.ordre);
      }

      return this.http.get<any[]>(`${this.apiUrl}/FilterEventStore`, { params });
  }

  filterCenterEvents(filters: { statut?: string, order?: 'asc' | 'desc' }): Observable<any[]> {
    let params = new HttpParams();
    
    if (filters.statut && filters.statut !== 'all') {
      params = params.set('statut', filters.statut);
    }
    
    if (filters.order) {
      params = params.set('order', filters.order);
    }

    return this.http.get<any[]>(`${this.apiUrl}/FilterEventCenter`, { params });
  }


  getSortedEvents(order: 'asc' | 'desc'): Observable<any[]> {
    const params = new HttpParams().set('order', order);
    return this.http.get<any[]>(`${this.apiUrl}/SortEvent`, { params });
  }


}