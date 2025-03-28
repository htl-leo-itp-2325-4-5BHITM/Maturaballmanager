import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

export interface DetailedTeamMemberDTO {
  id: number;
  keycloakId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  realmRoles: string[];
  note?: string;
  initialStoredAt: string;
  syncedAt: string;
}

export interface TeamMemberDTO {
  keycloakId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  realmRoles: string[];
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private baseUrl = environment.apiUrl + '/team-members';

  constructor(private http: HttpClient) {}

  getTeamMembers(): Observable<DetailedTeamMemberDTO[]> {
    return this.http.get<DetailedTeamMemberDTO[]>(`${this.baseUrl}/team`);
  }

  addTeamMember(member: TeamMemberDTO): Observable<DetailedTeamMemberDTO> {
    return this.http.post<DetailedTeamMemberDTO>(this.baseUrl, member);
  }

  updateTeamMember(id: number, member: TeamMemberDTO): Observable<DetailedTeamMemberDTO> {
    return this.http.put<DetailedTeamMemberDTO>(`${this.baseUrl}/${id}`, member);
  }

  deleteTeamMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchTeamMembers(query: string): Observable<DetailedTeamMemberDTO[]> {
    return this.http.get<DetailedTeamMemberDTO[]>(`${this.baseUrl}?query=${encodeURIComponent(query)}`);
  }
}
