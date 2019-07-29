import { StrictEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import { GlobalEvents } from '..';
import { TodoListPageFetchIO } from '../io/TodoListPageFetchTypes';

export default (emitter: StrictEmitter<GlobalEvents>, fetchIo: TodoListPageFetchIO) => {

  emitter.addListener('TodoListPage_FetchTodoList', fetchId => {
    const { cancel, response } = fetchIo.fetchTodoList(fetchId)
    response.then(
      todolist => emitter.emit('TodoListPage_TodoListFetchResponse', todolist),
      (errmsg: string) => emitter.emit('TodoListPage_TodoListFetchResponse', errmsg)
    )
    emitter.addListener('TodoListPage_CancelFetchTodoList', id => {
      if (id === fetchId) {
        cancel()
      }
    })
  })

}