import { TodoListId, TodoList } from '@alec/simple-todolist-common/dist/types/Data';

export interface CancelableFetchHandler<T> {
  cancel: Function
  response: Promise<T>
}
export interface TodoListPageFetchIO {
  fetchTodoList(id: TodoListId): CancelableFetchHandler<TodoList>
}
