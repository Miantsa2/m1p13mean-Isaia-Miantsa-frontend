import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UserService {
   private apiUrl = `${environment.apiUrl}/mean/user`;

  constructor(private http: HttpClient) {}

  createUser(data: any) {
    return this.http.post(`${this.apiUrl}/`, data);
  }  
}
