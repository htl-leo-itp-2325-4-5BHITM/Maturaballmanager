import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Benefit } from "../model/benefit";

@Injectable({
  providedIn: 'root'
})
export class BenefitService {
  private baseUrl = '/api/benefit';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Holt alle Gegenleistungen.
   */
  getBenefits(): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(`${this.baseUrl}`);
  }

  /**
   * Holt eine spezifische Gegenleistung anhand der ID.
   * @param id Die ID der Gegenleistung.
   */
  getBenefitById(id: string): Observable<Benefit> {
    return this.http.get<Benefit>(`${this.baseUrl}/${id}`);
  }

  /**
   * Fügt eine neue Gegenleistung hinzu.
   * @param benefit Die zu hinzufügende Gegenleistung.
   */
  addBenefit(benefit: Benefit): Observable<Benefit> {
    return this.http.post<Benefit>(`${this.baseUrl}`, benefit, this.httpOptions);
  }

  /**
   * Aktualisiert eine bestehende Gegenleistung.
   * @param benefit Die aktualisierte Gegenleistung.
   */
  updateBenefit(benefit: Benefit): Observable<Benefit> {
    return this.http.put<Benefit>(`${this.baseUrl}`, benefit, this.httpOptions);
  }

  /**
   * Löscht eine Gegenleistung anhand der ID.
   * @param id Die ID der zu löschenden Gegenleistung.
   */
  deleteBenefit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}