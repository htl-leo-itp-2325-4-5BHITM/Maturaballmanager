import {Company} from "Model/model";
import {collectEntry} from "./companyactions";
import {searchCompanyByName} from "./api";
import {exportEvents} from "./eventhandler";

export function render(companies: Company[]) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    companies.map((company) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<td class="py-6 px-6">${company.name}</td><td class="py-6 px-6">${company.address}</td><td class="py-6 px-6">${company.website}</td><td class="py-6 px-6"><input id="${company.id}" type="checkbox"></td>`;
        document.getElementById(`${company.id}`).addEventListener("click", () => {
            collectEntry(company.id, document.getElementById(`${company.id}`))
        });
    });
    exportEvents();
}




