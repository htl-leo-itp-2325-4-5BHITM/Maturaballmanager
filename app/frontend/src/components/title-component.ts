import {html, render} from "lit-html";
import {style} from '../styles/style'

class TitleComponent extends HTMLElement {

    constructor(){
        super()
        this.attachShadow({mode:'open'})
    }

    connectedCallback() {
        console.log("voll guter")
        render(this.template(), this.shadowRoot)
    }

    template() {
        return html`
            ${style}
            <h1 class="text-4xl font-bold text-indigo-700 mb-4">Maturaballmanager</h1>
            <h2 class="text-2xl font-bold text-gray-700 mb-8">Sponsorenverwaltung</h2>
        `
    }

}
customElements.define("title-component", TitleComponent)