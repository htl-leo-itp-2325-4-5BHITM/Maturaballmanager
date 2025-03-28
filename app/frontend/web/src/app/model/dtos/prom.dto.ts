export interface DayPlanDTO {
    name: string;
    time: string;
}

export interface PromDTO {
    motto: string;
    date: string;
    time: string;
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
    dayPlan: DayPlanDTO[];
}
