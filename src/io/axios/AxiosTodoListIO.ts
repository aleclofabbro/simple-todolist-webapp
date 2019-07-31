import { AxiosInstance } from 'axios';
import { TodoListIO } from '../../types/TodoListIO';
import { TodoList, TodoListId } from '../../types/Data';
import { from } from 'rxjs';

export default (axios: AxiosInstance): TodoListIO => {
  return {
    fetchTodoList: id => from(axios.request<TodoList>({
      method: 'GET',
      url: `todolists/${id}`
    }).then(resp => resp.data)),

    fetchTodoLists: () => from(axios.request<TodoList[]>({
      method: 'GET',
      url: `todolists/`
    }).then(resp => resp.data)),
    addTodoList: (name) => from(axios.request<TodoListId>({
      method: 'POST',
      url: `todolists/`,
      data: {
        name
      }
    }).then(resp => resp.data)),
    addTodoRowToList: (listId, text) => from(axios.request<TodoList>({
      method: 'POST',
      url: `todolists/${listId}/addRow`,
      data: { text }
    }).then(resp => resp.data)),
    removeList: (listId) => from(axios.request<unknown>({
      method: 'DELETE',
      url: `todolists/${listId}`
    }).then(resp => resp.data)),
    removeTodos: (listId, rowsId) => from(axios.request<TodoList>({
      method: 'POST',
      url: `todolists/${listId}/delRows`,
      data: {
        listId,
        rowsId
      }
    }).then(resp => resp.data)),
    setDoneFlag: (listId, rowsId, done) => from(axios.request<TodoList>({
      method: 'POST',
      url: `todolists/${listId}/setDoneFlags`,
      data: {
        listId,
        rowsId,
        done
      }
    }).then(resp => resp.data)),

  }
}
