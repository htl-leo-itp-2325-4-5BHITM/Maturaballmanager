import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Company } from "../model/companies";
import {ContactPerson} from "../model/contactperson";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private baseUrl = `${environment.apiUrl}/company`;

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {}

    /**
     * Holt alle Unternehmen.
     */
    getCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.baseUrl}`);
    }

    /**
     * Holt ein spezifisches Unternehmen anhand der ID.
     * @param id Die ID des Unternehmens.
     */
    getCompanyById(id: string): Observable<Company> {
        return this.http.get<Company>(`${this.baseUrl}/${id}`);
    }

    /**
     * Fügt ein neues Unternehmen hinzu.
     * @param company Das zu hinzufügende Unternehmen.
     */
    addCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(`${this.baseUrl}`, company, this.httpOptions);
    }

    /**
     * Aktualisiert ein bestehendes Unternehmen.
     * @param company Das aktualisierte Unternehmen.
     */
    updateCompany(company: Company): Observable<Company> {
        return this.http.put<Company>(`${this.baseUrl}/${company.id}`, company, this.httpOptions);
    }

    /**
     * Löscht ein Unternehmen anhand der ID.
     * @param id Die ID des zu löschenden Unternehmens.
     */
    deleteCompany(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    /**
     * Löscht mehrere Unternehmen anhand der IDs.
     * @param ids Die IDs der zu löschenden Unternehmen.
     */
    deleteCompanies(ids: string[]): Observable<void> {
        return new Observable(observer => {
            ids.forEach((id, index) => {
                this.deleteCompany(id).subscribe({
                    next: () => {
                        if (index === ids.length - 1) {
                            observer.next();
                            observer.complete();
                        }
                    },
                    error: (err) => {
                        observer.error(err);
                    }
                });
            });
        });
    }

    /**
     * Adds a new contact person.
     * @param contactPerson The contact person to add.
     * @param companyId
     */
    addContactPerson(contactPerson: ContactPerson, companyId: string): Observable<ContactPerson> {
        return this.http.post<ContactPerson>(
            `${this.baseUrl}/${companyId}/contact-persons`,
            contactPerson,
            this.httpOptions
        );
    }

    /**
     * Updates an existing contact person.
     * @param contactPerson The contact person to update.
     * @param companyId
     */
    updateContactPerson(contactPerson: ContactPerson, companyId: string): Observable<ContactPerson> {
        return this.http.put<ContactPerson>(
            `${this.baseUrl}/${companyId}/contact-persons/${contactPerson.id}`,
            contactPerson,
            this.httpOptions
        );
    }

    /**
     * Deletes a contact person.
     * @param contactPersonId The ID of the contact person to delete.
     */
    deleteContactPerson(contactPersonId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/contact-person/${contactPersonId}`);
    }


    /**
     * Retrieves contact persons for a specific company.
     * Assumes that the backend provides an endpoint like GET /api/company/{id}/contact-persons
     * If not, adjust accordingly based on your backend implementation.
     * @param companyId Company ID
     */
    getContactPersonsByCompany(companyId: string): Observable<ContactPerson[]> {
        return this.http.get<ContactPerson[]>(`${this.baseUrl}/${companyId}/contact-persons`);
    }
}