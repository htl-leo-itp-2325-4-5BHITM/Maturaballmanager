import { TeamMemberDTO } from '../services/user-management.service';

export interface AppointmentRequest {
    name: string;
    date: string;        // Format: yyyy-MM-dd (z. B. "2025-03-04")
    startTime?: string;  // Optional; wenn ganztägig, weglassen oder null
    endTime?: string;    // Optional; wenn ganztägig, weglassen oder null
    creatorId: number;
    memberIds: number[];
}

export interface AppointmentResponse {
    id: number;
    name: string;
    date: string;
    startTime?: string;
    endTime?: string;
    creator: TeamMemberDTO;
    members: TeamMemberDTO[];
}