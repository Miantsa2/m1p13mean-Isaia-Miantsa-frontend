import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
 providedIn: 'root'
})
export class SalleService {
    private apiUrl = `${environment.apiUrl}/mean/room`;

    constructor(private http: HttpClient) {}
    getRoom(): Observable<any> {
      return this.http.get(`${this.apiUrl}/getRoom`);
      }
   
    updateRoom(id: string, room: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/updateRoom/${id}`, room);
      }

    addRoom(room: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/createRoom`, room);
    }

    deleteRoom(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/deleteRoom/${id}`);
    }

    getFreeRoom(): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/freeRoom`);
    }

    filterSalles(options: { statut?: string; ordre?: 'asc' | 'desc'; taille?: number }): Observable<any> {
      let params: any = {};
      if (options.statut) params.statut = options.statut;
      if (options.ordre) params.ordre = options.ordre;
      if (options.taille !== undefined) params.taille = options.taille;

      return this.http.get(`${this.apiUrl}/filterRoom`, { params });
    }


}