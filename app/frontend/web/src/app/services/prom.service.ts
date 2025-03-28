import {Injectable} from '@angular/core';
import {PromDTO} from "../model/dtos/prom.dto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PromService {

  constructor(private http: HttpClient) { }

  getActiveProm(): Promise<PromDTO | undefined> {
    return this.http.get<PromDTO>(`${environment.apiUrl}/prom`).toPromise()
  }

  createProm(promData: PromDTO) {
    return this.http.post(`${environment.apiUrl}/prom`, promData).toPromise();
  }

  updateProm(promId: string, promData: PromDTO) {
    return this.http.put(`${environment.apiUrl}/prom/${promId}`, promData).toPromise();
  }

  deactivateProm(promId: string) {
    return this.http.put(`${environment.apiUrl}/prom/${promId}/deactivate`, {}).toPromise();
  }
}
