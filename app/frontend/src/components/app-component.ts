import {html, render} from "lit-html";
import './title-component'
import './sponsor-table-component'
import './add-company-component'

class AppComponent extends HTMLElement {
    constructor(){
        super()
    }

    connectedCallback() {
        render(this.template(), this)
    }

    template() {
        return html`
            <div>
                <title-component></title-component>
                <sponsor-table-component></sponsor-table-component>
                <add-company-component></add-company-component>
            </div>
        `
    }

}
customElements.define("app-component", AppComponent)