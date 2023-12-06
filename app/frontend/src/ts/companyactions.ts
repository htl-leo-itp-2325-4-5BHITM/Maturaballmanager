import axios from "axios"
import {Company} from "Model/model";
import {render} from "./render-companylist";
import {getCompanies} from "./api";

let myArray1: Array<HTMLElement> = [];

let myArray2: Array<number> = [];


// collects all entry when selected and saves them in an array
export const collectEntry = (companyId: number, element: HTMLElement) => (
    (console.log(companyId), console.log(element), myArray1.push(element), myArray2.push(companyId))
);


export const getSearchBarValues = async () => {
    const [field1, field2, field3] = ["field1", "field2", "field3"].map(id => document.getElementById(id) as HTMLInputElement);

    const myJson = {companyname: field1.value, adresse: field2.value, website: field3.value};

    console.log("Dein JSON Objekt Schatzi<33");
    console.log(myJson);

    addCompany(field1.value, field2.value, field3.value);
};


const addCompany = async (newName: string, newAddress: string, newWebsite: string): Promise<Company> => {
    const newCompany = {name: newName, address: newAddress, website: newWebsite};

    const config = {headers: {'Content-Type': 'application/json'}};

    try {
        const response = await axios.post('http://localhost:4200/api/addCompany', newCompany, config);
        console.log(response.data);
        const companies = await getCompanies();
        render(companies);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const deleteAllEntries = async (): Promise<void> => {
    const config = {headers: {Accept: 'application/json'}};

    try {
        for (let i = 0; i < myArray1.length; i++) {
            const response = await axios.delete(`http://localhost:4200/api/deleteCompany/${myArray2[i]}/company`, config);
            console.log(response.data);
            myArray1[i].parentElement?.parentElement?.remove();
        }

        myArray1.length = myArray2.length = 0;
    } catch (error) {
        console.log(error);
        throw error;
    }
};