import { Company } from "Model/model";

export function render(companies: Company[]) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = '';

    companies.map((company) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.innerHTML = `<td>${company.name}</td><td>${company.address}</td><td>${company.website}</td>`;
    });
}
