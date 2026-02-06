import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Boutique {
  private apiUrl = `${environment.apiUrl}/mean/boutique`;

  constructor(private http: HttpClient) {}

  getBoutiques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getBoutiques`);
  }

  createBoutique(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createBoutique`, data);
  }

  deleteBoutique(id: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteBoutique/${id}`);
  }
}