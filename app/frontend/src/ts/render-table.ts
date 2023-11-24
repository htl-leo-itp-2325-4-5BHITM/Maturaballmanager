import {Company} from "Model/model";
import {addEntry, collectEntry, deleteAllEntries} from "./companyactions";
import {searchCompanyByName} from "./api";

export function render(companies: Company[]) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    companies.map((company) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<td class="py-6 px-6">${company.name}</td><td class="py-6 px-6">${company.address}</td><td class="py-6 px-6">${company.website}</td><td class="py-6 px-6"><input id="${company.id}" type="checkbox"></td>`;
        document.getElementById(`${company.id}`).addEventListener("click", () => {
            collectEntry(company.id, document.getElementById(`${company.id}`))
            // deleteEntry(company.id, document.getElementById(`${company.id}`))
        });
    });
}

const searchbar = document.getElementById("searchbar") as HTMLInputElement;

const searchbutton = document.getElementById("searchbutton");

searchbutton.addEventListener("click", () => {
        searchCompanyByName(searchbar.value)
});

const deletebutton = document.getElementById("deletebutton")

deletebutton.addEventListener("click", () => {
    deleteAllEntries();
})


const addbutton = document.getElementById("addbutton")

addbutton.addEventListener("click", () => {
    addEntry();
})






