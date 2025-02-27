export interface Appointment {
    id: number;
    name: string;
    date: string;
    startTime: string;
    endTime?: string | null;
    creator: TeamMemberDTO;
    members: TeamMemberDTO[];
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