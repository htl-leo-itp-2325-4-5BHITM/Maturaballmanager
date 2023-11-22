import { Company } from "Model/model";
import {deleteEntry} from "./companyactions";

export function render(companies: Company[]) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    companies.map((company) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<td class="py-6 px-6">${company.name}</td><td class="py-6 px-6">${company.address}</td><td class="py-6 px-6">${company.website}</td><td class="py-6 px-6"><button id="${company.id}edit" class="button primary-button">Edit</button><button id="${company.id}delete" class="button danger-button">Delete</button><input type="checkbox"></td>`;
        document.getElementById(`${company.id}delete`).addEventListener("click", () => {
            deleteEntry(company.id, document.getElementById(`${company.id}delete`))
        });
    });
}


