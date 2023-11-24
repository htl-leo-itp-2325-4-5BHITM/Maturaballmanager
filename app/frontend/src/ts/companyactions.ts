/*import axios from "axios";

export async function deleteEntry(companyid: number) : Promise<any> {
    //    // element.parentElement.parentElement.remove();
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }

    try {
        const response = await axios.delete(`http://localhost:4200/api/deleteCompany/${companyid}/company`, config);
        console.log(response.data);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
*/

import axios from "axios"
import {Company} from "Model/model";
import {render} from "./render-table";
import {getCompanies} from "./api";

let myArray1: Array<HTMLElement> = [];

let myArray2: Array<number> = [];

/*
export async function deleteEntry(companyId: number, element: HTMLElement): Promise<void> {
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }

    try {
        const response = await axios.delete(`http://localhost:4200/api/deleteCompany/${companyId}/company`, config);
        console.log(response.data);
        element.parentElement?.parentElement?.remove();
    } catch (error) {
        console.log(error);
        throw error;
    }
}


 */

export async function addEntry() {
    let field1 = document.getElementById("field1") as HTMLInputElement;
    let field2 = document.getElementById("field2")  as HTMLInputElement;
    let field3 = document.getElementById("field3" )  as HTMLInputElement;

    const myJson = {
        companyname: field1.value,
        adresse: field2.value,
        website: field3.value
    }

    console.log("Dein JSON Objekt Schatzi<33")
    console.log(myJson)

    addCompany(field1.value, field2.value, field3.value)
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
        const companies =  await getCompanies();
        render(companies);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

export async function deleteAllEntries(): Promise<void> {
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }

    try {
        for (let i = 0; i < myArray1.length; i++) {
            const response = await axios.delete(`http://localhost:4200/api/deleteCompany/${myArray2[i]}/company`, config);
            console.log(response.data);
            myArray1[i].parentElement?.parentElement?.remove();
        }
        myArray1.splice(0, myArray1.length);
        myArray2.splice(0, myArray2.length);
    } catch (error) {
        console.log(error);
        throw error;
    }


}


export function collectEntry(companyId: number, element: HTMLElement) {
    console.log(companyId)
    console.log(element)


    myArray1.push(element);
    myArray2.push(companyId);
}



