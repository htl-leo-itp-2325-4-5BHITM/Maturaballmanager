import {html, render} from "lit-html"
import {style} from '../styles/style'
import {loadData} from "../services/loadData-service"
import {Company} from "../model/model";
import {deleteCompany} from "../services/changeData-service";

class SponsorTableComponent extends HTMLElement {

    constructor(){
        super()
        this.attachShadow({mode:'open'})
    }

    async connectedCallback() {
        const data = await loadData();
        render(this.template(data), this.shadowRoot)
    }

    template(data: Company[]) {
        const rows = data.map(element => html`
            <tr>
                <td>${element.name}</td>
                <td>${element.officeMail}</td>
                <td>${element.website}</td>
                <td><input type="checkbox" class="delete-checkbox"></td>
            </tr>
        `)
        return html`
            ${style}
            <table id="sponsor-table">
                <thead>
                <th>Firmenname</th>
                <th>Office Mail</th>
                <th>Website</th>
                <th>&nbsp;</th>
                </thead>
                <tbody>
                ${rows}
                
                </tbody>
            </table>
            <div @click=${() => this.deleteCompany()} id="delete-button">delete</div>
        `
    }

    private deleteCompany() {
        const checkboxes = this.shadowRoot.querySelectorAll('.delete-checkbox');

        checkboxes.forEach((checkbox) => {
            if ((checkbox as HTMLInputElement).checked) {
                const row = checkbox.closest('tr');
                if (row) {
                    const name = row.children[0].textContent;
                    const officeMail = row.children[1].textContent;
                    const website = row.children[2].textContent;

                    deleteCompany(name, officeMail, website)
                        .then(() => {
                            console.log(`Deleted: ${name}`);
                            row.remove();
                        })
                        .catch((error) => {
                            console.error(`Error at ${name}:`, error);
                        });
                }
            }
        });
    }

}
customElements.define("sponsor-table-component", SponsorTableComponent)