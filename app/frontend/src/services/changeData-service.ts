import axios from "axios";

export async function addCompany(name: string, officeMail: string, website: string) {
    const company = {name: name, officeMail: officeMail, website: website, address: null, contact: null};
    const config = {headers: {'Content-Type': 'application/json'}};
    const response = await axios.post('http://localhost:4200/api/companies/addCompany', company, config)
}

export async function deleteCompany(name: string, officeMail: string, website: string) {
    const company = {name: name, website: "", contactPerson: {}, address: {}};
    const config = {headers: {'Content-Type': 'application/json'}};
    const response = await axios.post('http://localhost:4200/api/companies/deleteCompany', company, config)
}