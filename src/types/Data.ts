export type TodoListId = string
export type TodoRowId = string
export interface Todo {
  id: TodoRowId
  text: string
  done: boolean
}
export interface TodoList {
  id: TodoListId
  name: string
  todos: Todo[]

}
export const TodoListIdRegExp = /[0-9a-z]+/
