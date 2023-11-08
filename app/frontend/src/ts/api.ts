import axios from "axios";
import {Company} from "Model/model";

/*
async function getCompanies() {
    try {
        const response : Response = await fetch('http://localhost:4200/api/getCompanyList');
        console.log(response)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('There was a problem fetching the companies data: ', error);
    }
}*/

async function getCompanies():  Promise<Company[]> {
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



export {getCompanies};
