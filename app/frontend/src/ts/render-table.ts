import { Company } from "Model/model";
import {deleteEntry} from "./companyactions";

export function render(companies: Company[]) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    companies.map((company) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<td>${company.name}</td><td>${company.address}</td><td>${company.website}</td><td><button id="${company.id}edit" class="button primary-button">Edit</button><button id="${company.id}delete" class="button danger-button">Delete</button></td>`;
        document.getElementById(`${company.id}delete`).addEventListener("click", () => {
            deleteEntry(company.id, document.getElementById(`${company.id}delete`))
        });
    });
}


