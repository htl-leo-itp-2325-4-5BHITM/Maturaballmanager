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
    address: string;
    website: string;
    contact: CompanyPerson;
}

interface Model {
    companies: Company[]
    todos: Todo[]
}

interface Todo {
    userId: number
    id: number
    title: string
    completed: boolean
}

export { Company, CompanyPerson, Model, Todo };
