import { Company } from "Model/model";
import { deleteEntry } from "./companyactions";

export function render(companies: Company[]) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    companies.map((company) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<td>${company.name}</td><td>${company.address}</td><td>${company.website}</td><td><button class="edit-button">Edit</button><button class="delete-button" onclick="deleteEntry(company.id, this)">Delete</button></td>`;
    });
}