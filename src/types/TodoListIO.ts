import { TodoListId, TodoList, TodoRowId } from './Data';
import { Observable } from 'rxjs'

export interface TodoListIO {
  fetchTodoList(id: TodoListId): Observable<TodoList>
  addTodoRowToList(id: TodoListId, text: string): Observable<TodoList>
  setDoneFlag(id: TodoListId, rowIds: TodoRowId[], done: boolean): Observable<TodoList>
  removeTodos(id: TodoListId, rowIds: TodoRowId[]): Observable<TodoList>
  removeList(id: TodoListId): Observable<unknown>
  addTodoList(name: string): Observable<TodoListId>
  fetchTodoLists(): Observable<TodoList[]>
}
