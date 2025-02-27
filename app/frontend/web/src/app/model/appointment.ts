export interface AppointmentRequest {
    id?: number;
    name: string;
    date: string;
    startTime?: string;
    endTime?: string;
    creator: {
        id: number
    };
    members: {
        id: number
    }[];
}

export interface AppointmentResponse {
    id?: number;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    creator: {
        id: number,
        firstName: string,
        lastName: string
    };
    members: {
        id: number,
        firstName: string,
        lastName: string
    }[];
}
