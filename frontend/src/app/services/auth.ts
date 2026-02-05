import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/mean/auth`;
 

  constructor(private http: HttpClient) { }

  signup(user: any): Observable<{ token: string, user: any }> {
    return this.http.post<{ token: string, user: any }>(
      `${this.apiUrl}/signup`,
      user
    ).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, { email, password });
  // }

  login(email: string, password: string) {
    return this.http.post<{ token: string, user: { id: string, email: string, role: string } }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }


  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google`;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  // getHome() {
  //   this.http.get('http://localhost:5000/mean/client/home').subscribe(console.log);
  // }

  //  getHome2() {
  //   this.http.get('http://localhost:5000/mean/client/test').subscribe(console.log);
  // }
}
