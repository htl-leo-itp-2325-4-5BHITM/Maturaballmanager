import {html, render} from "lit-html"
import {style} from '../styles/style'
import {loadAllTodos} from "../services/todo-service"
import {Todo} from "../model/model";

class SponsorTableComponent extends HTMLElement {

    constructor(){
        super()
        this.attachShadow({mode:'open'})
    }

    async connectedCallback() {
        console.log("voll guter")
        const todos = await loadAllTodos();
        render(this.template(todos), this.shadowRoot)
    }

    template(todos: Todo[]) {
        const rows = todos.map(todo => html`
            <tr>
                <td>${todo.id}</td>
                <td>${todo.title}</td>
            </tr>
        `)
        return html`
            ${style}
            <table>
                <thead>
                <th>Id</th>
                <th>Title</th>
                </thead>
                <tbody>
                ${rows}
                </tbody>
            </table>
        `
    }

}
customElements.define("sponsor-table-component", SponsorTableComponent)