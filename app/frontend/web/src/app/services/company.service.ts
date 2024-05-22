import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, Subject} from 'rxjs';
import {apiUrl} from "../app.config";
import {CompanyOverviewDTO} from "../model/dto/CompanyOverviewDTO";
import {CompanyDetailDTO} from "../model/dto/CompanyDetailDTO";
import {Company} from "../model/Company";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {ContactPerson} from "../model/ContactPerson";
import {CompanyFormData} from "../model/dto/CompanyFormData";
import {Address} from "../model/Address";


interface CompanyResponseDTO {
    id: number | null;
    companyName: string;
    website: string;
    officeMail: string;
    officePhone: string;
    address: Address | null;
    contactPersons: ContactPerson[];
}

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private companyUpdated = new Subject<CompanyResponseDTO>();

    constructor(private http: HttpClient) {
    }

    getCompanyOverview(): Observable<CompanyOverviewDTO[]> {
        return this.http.get<CompanyOverviewDTO[]>(apiUrl + "/companies/overview");
    }

    getCompanyDetail(id: number): Observable<CompanyDetailDTO> {
        return this.http.get<CompanyDetailDTO>(`${apiUrl}/companies/detail/${id}`);
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'my-auth-token'
        })
    };

    updateCompany(data: any): Observable<CompanyResponseDTO> {
        return this.http.post<CompanyResponseDTO>(`${apiUrl}/companies/persist/${data.id}`, data, this.httpOptions);
    }

    getCompanyUpdateListener(): Observable<CompanyResponseDTO> {
        return this.companyUpdated.asObservable();
    }

    companyUpdatedNotification(company: CompanyResponseDTO) {
        this.companyUpdated.next(company);
    }

    saveContactPerson(data: any): Observable<ContactPerson> {
        return this.http.post<ContactPerson>(`${apiUrl}/companies/contact-person`, data, this.httpOptions);
    }
}
