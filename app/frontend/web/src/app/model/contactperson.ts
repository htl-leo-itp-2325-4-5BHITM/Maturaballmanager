export interface ContactPerson {
    id?: string;
    prefixTitle?: string;
    firstName: string;
    lastName: string;
    suffixTitle?: string;
    gender: 'M' | 'W' | 'D';
    position: string;
    personalEmail?: string;
    personalPhone?: string;
}
