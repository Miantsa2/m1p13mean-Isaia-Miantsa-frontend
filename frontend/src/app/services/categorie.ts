import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Categorie {
  private apiUrl = `${environment.apiUrl}/mean/categorie`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getCategorie`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createCategorie`, data);
  }
}
