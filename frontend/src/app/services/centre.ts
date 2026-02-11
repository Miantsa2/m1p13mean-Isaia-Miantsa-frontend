import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
 providedIn: 'root'
})
export class CentreService {
    private apiUrl = `${environment.apiUrl}/mean/center`;

    constructor(private http: HttpClient) {}
    getCenter(): Observable<any> {
      return this.http.get(`${this.apiUrl}/getCenter`);
      }
   
    updateCenter(id: string, center: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/updateCenter/${id}`, center);
      }

    updatePrice(id: string, price: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/updatePrice/${id}`, { prixMetreCarre: price });
    }

    addNotif(id: String, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/updateNotif/${id}`, data);
    }

    markAllNotificationsAsRead(centreId: string): Observable<any> {
     return this.http.put(`${this.apiUrl}/readNotif/${centreId}/notifications/lue`, {});
    }

}