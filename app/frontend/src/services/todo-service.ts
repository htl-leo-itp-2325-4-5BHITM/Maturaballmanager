import {Todo} from "../model/model"

export async function loadAllTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const todos: Todo[] = await response.json()
    console.log(todos)
    return todos
}