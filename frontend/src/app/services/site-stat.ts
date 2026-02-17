import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SiteStat {

  private apiUrl = `${environment.apiUrl}/mean/dashboardAdmin`;

  constructor(private http: HttpClient) {}

   incrementVisit(): Observable<{ nombre_visite: number }> {
    return this.http.post<{ nombre_visite: number }>(`${this.apiUrl}/visit`, {});
  }

   getTotalVisits(): Observable<{ nombre_visite: number }> {
    return this.http.get<{ nombre_visite: number }>(`${this.apiUrl}/visitors`);
  }

}
