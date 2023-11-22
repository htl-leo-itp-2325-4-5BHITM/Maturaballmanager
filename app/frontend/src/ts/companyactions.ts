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

let myArray1: Array<HTMLElement> = [];

let myArray2: Array<number> = [];


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



