import React, { useState, useEffect, useContext } from 'react';
import { TodoListCard } from '../components/TodoListCard';
import { RouteComponentProps, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { TodoListIOCtx } from '../ctx';
import { TodoList, TodoListId } from '../types/Data';
import { mergeMap } from 'rxjs/operators';

type PageState =
  | { status: 1 }
  | { status: 2, errorMsg: string }
  | { status: 3, lists: TodoList[] }


const DashboardPage: React.FC<RouteComponentProps> = (_) => {
  const todolistsIO = useContext(TodoListIOCtx)

  const [shouldRedirectId, setShouldRedirectId] = useState<TodoListId | null>(null)
  const [pageState, setPageState] = useState<PageState>({ status: 1 })



  useEffect(() => {
    const sub = todolistsIO.fetchTodoLists()
      .subscribe(lists => {
        setPageState({ status: 3, lists })
      }, err => {
        setPageState({ status: 2, errorMsg: String(err) })
      })
    return () => sub.unsubscribe()
  },
    // eslint-disable-next-line 
    [todolistsIO])


  const addHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      setTodolistToAdd(e.currentTarget.value)
      e.currentTarget.value = ''
    }
  }
  const [todolistToAdd, setTodolistToAdd] = useState<string | null>(null)
  useEffect(() => {
    if (pageState.status === 3 && todolistToAdd) {
      const sub = todolistsIO.addTodoList(todolistToAdd)
        .subscribe(
          newListId => setShouldRedirectId(newListId),
          err => alert(String(err)),
          () => setTodolistToAdd(null)
        )
      return () => sub.unsubscribe()
    }
    return
  }, [todolistToAdd, todolistsIO, pageState.status])

  const [listIdToRemove, setListIdToRemove] = useState<TodoListId | null>(null)
  useEffect(() => {
    if (pageState.status === 3 && listIdToRemove) {

      const sub = todolistsIO.removeList(listIdToRemove)
        .pipe(
          mergeMap(todolistsIO.fetchTodoLists)
        ).subscribe(
          lists => setPageState({ status: 3, lists }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setListIdToRemove(null)
        )
      return () => sub.unsubscribe()
    }
    return
  }, [listIdToRemove, todolistsIO, pageState.status])

  return (
    <>
      {shouldRedirectId && <Redirect to={`/todolist/${shouldRedirectId}`} />}
      <Link to="/">home</Link>

      {
        pageState.status === 1
          ? <h2>Wait, Fetching todoLists</h2>

          : pageState.status === 2
            ? (
              <div>
                <h1>Fetch Error: ${pageState.errorMsg} </h1>
              </div>
            )

            : (
              < >
                <div className="row">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Add todo list" onKeyDown={addHandler} />
                  </div>
                </div>
                <div className="row">
                  {
                    pageState.lists.map(todolist => <TodoListCard key={todolist.id} {...{
                      todolist: todolist,
                      deleteList: () => setListIdToRemove(todolist.id)
                    }} />)
                  }
                </div>
              </>
            )

      }
    </>
  );
}

export default DashboardPage;
