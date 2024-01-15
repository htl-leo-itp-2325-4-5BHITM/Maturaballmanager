import {html, render} from "lit-html";
import './title-component'
import './sponsor-table-component'

class AppComponent extends HTMLElement {
    constructor(){
        super()
        console.log("voll gut")
    }

    connectedCallback() {
        console.log("voll guter")
        render(this.template(), this)
    }

    template() {
        return html`
            <div class="container mx-auto p-8">
                <title-component></title-component>
                <sponsor-table-component></sponsor-table-component>
            </div>
        `
    }

}
customElements.define("app-component", AppComponent)