import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 


@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private api = `${environment.apiUrl}/mean/dashboardAdmin`;

  constructor(private http: HttpClient) {}

  getChiffreAffaire(year?: string, month?: string) {
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    if (month) params = params.set('month', month);
    return this.http.get<any>(`${this.api}/centre/chiffre-affaire`, { params });
  }

  getRepartition(year?: string) {
     let params = new HttpParams();
    if (year) params = params.set('year', year);
    return this.http.get<any>(`${this.api}/centre/chiffre-affaire/repartition`, { params });
  }

  getEvolutionMensuelle(year?: string, month?: string) {
     let params = new HttpParams();
    if (year) params = params.set('year', year);
    if (month) params = params.set('month', month);
    return this.http.get<any[]>(`${this.api}/centre/chiffre-affaire/evolution/mensuel`, { params });
  }

  getVisitors(year?: string, month?: string) {
     let params = new HttpParams();
    if (year) params = params.set('year', year);
    if (month) params = params.set('month', month);
    return this.http.get<any>(`${this.api}/visitors`, { params });
  }

  getStores(year?: string, month?: string) {
     let params = new HttpParams();
    if (year) params = params.set('year', year);
    if (month) params = params.set('month', month);
    return this.http.get<any>(`${this.api}/stores/count`, { params });
  }

  getProducts(year?: string, month?: string) {
     let params = new HttpParams();
    if (year) params = params.set('year', year);
    if (month) params = params.set('month', month);
    return this.http.get<any>(`${this.api}/products/count`, { params });
  }

  getRoomsLibres() {
    return this.http.get<any>(`${this.api}/rooms/libres/count`);
  }
}
