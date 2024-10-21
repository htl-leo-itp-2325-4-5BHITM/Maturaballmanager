import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Benefit } from "../model/benefit";
import { environment } from '../../environments/environment'; // Importiere Umgebungsvariablen

@Injectable({
  providedIn: 'root'
})
export class BenefitService {
  private baseUrl = `${environment.apiUrl}/benefit`;  // Dynamische URL basierend auf Umgebung

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getBenefits(): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(`${this.baseUrl}`);
  }

  getBenefitById(id: string): Observable<Benefit> {
    return this.http.get<Benefit>(`${this.baseUrl}/${id}`);
  }

  addBenefit(benefit: Benefit): Observable<Benefit> {
    return this.http.post<Benefit>(`${this.baseUrl}`, benefit, this.httpOptions);
  }

  updateBenefit(benefit: Benefit): Observable<Benefit> {
    return this.http.put<Benefit>(`${this.baseUrl}/${benefit.id}`, benefit, this.httpOptions);
  }

  deleteBenefit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
