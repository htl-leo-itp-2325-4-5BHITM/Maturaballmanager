import {html, render} from "lit-html";
import {style} from '../styles/style'
import {addCompany} from "../services/changeData-service";

class AddCompanyComponent extends HTMLElement {

    constructor(){
        super()
        this.attachShadow({mode:'open'})
    }

    connectedCallback() {
        render(this.template(), this.shadowRoot)
    }

    template() {
        return html`
            ${style}
            <h3>Neue Firma</h3>
            <input type="text" id="name-input" placeholder="Name">
            <input type="text" id="office-mail-input" placeholder="Office Mail">
            <input type="text" id="website-input" placeholder="Webseite">
            <div @click=${() => this.addNewCompany()} id="add-button">Speichern</div>
        `
    }

    private addNewCompany() {
        const name = (this.shadowRoot.getElementById('name-input') as HTMLInputElement).value;
        const officeMail = (this.shadowRoot.getElementById('office-mail-input') as HTMLInputElement).value;
        const website = (this.shadowRoot.getElementById('website-input') as HTMLInputElement).value;

        addCompany(name, officeMail, website);
    }

}
customElements.define("add-company-component", AddCompanyComponent)