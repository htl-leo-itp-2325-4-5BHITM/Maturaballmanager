import {Company} from "../model/model"

export async function loadData() {
    const response = await fetch('http://localhost:4200/api/companies/')
    const companies: Company[] = await response.json()
    console.log(companies)
    return companies
}