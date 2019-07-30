// import { AxiosInstance } from 'axios';
// import { TodoListIO } from '../TodoListIO';
// import { TodoList } from '../types/Data';
// import { from } from 'rxjs';

// export default (axios: AxiosInstance): TodoListIO => {
//   return {
//     fetchTodoList: id => from(axios.request<TodoList>({
//       method: 'GET',
//       url: `todolists/${id}`
//     }).then(resp => resp.data)),

//     fetchTodoLists: () => from(axios.request<TodoList[]>({
//       method: 'GET',
//       url: `todolists/`
//     }).then(resp => resp.data))

//   }
// }

export default null