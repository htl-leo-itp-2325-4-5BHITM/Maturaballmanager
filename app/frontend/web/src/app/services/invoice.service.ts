// src/app/services/invoice.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../model/invoice';
import { ContactPerson } from '../model/contactperson';
import {environment} from "../../environments/environment";
import {InvoiceDTO} from "../model/dtos/invoice.dto";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  /**
   * Ruft alle Rechnungen ab.
   */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  /**
   * Ruft eine spezifische Rechnung anhand der ID ab.
   * @param id Rechnungs-ID
   */
  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  /**
   * Erstellt eine neue Rechnung.
   * @param invoice Rechnungsdaten
   */
  createInvoice(invoice: InvoiceDTO): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  /**
   * Aktualisiert eine bestehende Rechnung.
   * @param id Rechnungs-ID
   * @param invoice Aktualisierte Rechnungsdaten
   */
  updateInvoice(id: string, invoice: InvoiceDTO): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  /**
   * Löscht eine Rechnung anhand der ID.
   * @param id Rechnungs-ID
   */
  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Sendet eine Rechnung per E-Mail.
   * @param id Rechnungs-ID
   */
  sendInvoice(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/send`, {});
  }

  /**
   * Lädt das PDF einer Rechnung herunter.
   * @param id Rechnungs-ID
   */
  downloadInvoicePdf(id: string): Observable<Blob> {
    const headers = new HttpHeaders().append('Accept', 'application/pdf');
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { headers, responseType: 'blob' }) as Observable<Blob>;
  }

  /**
   * Ruft Kontaktpersonen für eine spezifische Firma ab.
   * @param companyId Firmen-ID
   */
}