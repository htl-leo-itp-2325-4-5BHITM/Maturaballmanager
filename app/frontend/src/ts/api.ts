import axios from "axios";
import {Company} from "Model/model";


async function getCompanies(): Promise<Company[]> {
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }
    try {
        const response = await axios.get('http://localhost:4200/api/getCompanyList', config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addCompany(newName: String, newAddress: String, newWebsite: String): Promise<Company> {

    const newCompany = {
        name: newName,
        address: newAddress,
        website: newWebsite
    };

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await axios.post('http://localhost:4200/api/addCompany', newCompany, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function searchCompanyByName(searchTerm: String): Promise<Company | undefined> {
    const companies =  await getCompanies();
    console.log(companies.find(company => company.name === searchTerm))
    return companies.find(company => company.name === searchTerm);
}

async function debounce(func, delay = 300) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

// not implemented in frontend yet
async function updateCompany(company: Company): Promise<Company> {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await axios.post('http://localhost:4200/api/updateCompany', company, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export {getCompanies};
export {addCompany};
export {updateCompany};
export {searchCompanyByName};
export {debounce};