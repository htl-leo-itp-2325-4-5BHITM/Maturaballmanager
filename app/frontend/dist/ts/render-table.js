export function render(companies) {
    const tbody = document.querySelector("tbody");
    //console.log("body is: ", tbody);
    //console.log("companies are", companies);
    tbody.innerHTML = '';
    console.log(companies);
    companies.forEach(company => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        const tds = `<td>${company.name}</td><td>${company.address}</td><td>${company.website}</td><td>${company.contact.firstname}</td><td>${company.contact.lastname}</td><td>${company.contact.email}</td><td>${company.contact.number}</td><td>${company.contact.notes}</td>`;
        tr.innerHTML = tds;
    });
}
//# sourceMappingURL=render-table.js.map