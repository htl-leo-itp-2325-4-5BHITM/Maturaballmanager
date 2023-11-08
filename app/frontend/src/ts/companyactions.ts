import axios from "axios";

export async function deleteEntry(companyid: number, element: HTMLElement) : Promise<any> {
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