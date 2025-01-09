// src/app/services/invoice.service.ts

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Invoice} from '../model/invoice';
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
   * Sendet die Rechnung an eine spezifische Zieladresse (OFFICE oder CONTACT_PERSON).
   * @param invoiceId ID der Rechnung
   * @param target Ziel der E-Mail (OFFICE oder CONTACT_PERSON)
   */
  sendInvoice(invoiceId: string, target: 'OFFICE' | 'CONTACT_PERSON'): Observable<any> {
    const url = `${this.apiUrl}/${invoiceId}/send`;
    return this.http.post(url, {target});
  }

  /**
   * Lädt das PDF einer Rechnung herunter.
   * @param id Rechnungs-ID
   */
  generateInvoicePdf(id: string): Observable<Blob> {
    const headers = new HttpHeaders().append('Accept', 'application/pdf');
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { headers, responseType: 'blob' }) as Observable<Blob>;
  }

  /**
   * Sendet die Rechnung an eine spezifische E-Mail-Adresse.
   * @param invoiceId ID der Rechnung
   * @param email Ziel-E-Mail-Adresse
   */
  sendInvoiceToEmail(invoiceId: string, email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${invoiceId}/send`, {});
  }
}