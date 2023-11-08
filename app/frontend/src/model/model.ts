interface CompanyPerson {
    firstname: string;
    lastname: string;
    email: string;
    number: string;
    notes: string;
}

interface Company {
    name: string;
    address: string;
    website: string;
    contact: CompanyPerson;
}

interface Model {
    companies: Company[];
}

export { Company, CompanyPerson, Model };
