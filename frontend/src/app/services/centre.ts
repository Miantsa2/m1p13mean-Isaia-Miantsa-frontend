import { Injectable } from '@angular/core';
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
      return this.http.get(this.apiUrl);
      }
   
    updateCenter(id: string, center: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, center);
      }

}