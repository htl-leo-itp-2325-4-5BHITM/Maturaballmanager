interface CompanyPerson {
    firstname: string;
    lastname: string;
    email: string;
    number: string;
    notes: string;
}

interface Company {
    id: number;
    name: string;
    officeMail: string;
    website: string;
    address: Address;
    contact: CompanyPerson;
}

interface Address {
    street: string;
    houseNumber: string;
    floor: string;
    door: string;
    zipCode: string;
    town: string;
}

export { Company, CompanyPerson };
