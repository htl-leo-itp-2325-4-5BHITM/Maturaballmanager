import {html, render} from "lit-html";
import {style} from '../styles/style'

class TitleComponent extends HTMLElement {

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
            <h1>Maturaballmanager</h1>
            <h2>Sponsorenverwaltung</h2>
        `
    }

}
customElements.define("title-component", TitleComponent)