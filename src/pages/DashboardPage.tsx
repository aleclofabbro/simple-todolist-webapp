import React, { useState, useEffect, useContext } from 'react';
import { TodoListCard } from '../components/TodoListCard';
import { RouteComponentProps, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { TodoListIOCtx } from '../ctx';
import { TodoList, TodoListId } from '../types/Data';
import { mergeMap } from 'rxjs/operators';
import { Mask } from '../components/Mask';

type PageState =
  | { fetching: true, error: false }
  | { fetching: false, error: true, msg: string }
  | { fetching: false, error: false, updating: boolean, lists: TodoList[] }


const DashboardPage: React.FC<RouteComponentProps> = (_) => {
  const todolistsIO = useContext(TodoListIOCtx)

  const [shouldRedirectId, setShouldRedirectId] = useState<TodoListId | null>(null)
  const [pageState, setPageState] = useState<PageState>({ fetching: true, error: false })

  const addHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      todolistsIO.addTodoList(e.currentTarget.value)
        .subscribe(setShouldRedirectId,
          err => {
            alert(String(err))
          })
      e.currentTarget.value = ''
    }
  }


  useEffect(() => {
    const sub = todolistsIO.fetchTodoLists()
      .subscribe(lists => {
        setPageState({ fetching: false, error: false, updating: false, lists })
      }, err => {
        setPageState({ fetching: false, error: true, msg: String(err) })
      })
    return () => sub.unsubscribe()
  },
    // eslint-disable-next-line 
    [todolistsIO])

  const [listIdToRemove, setListIdToRemove] = useState<TodoListId | null>(null)
  useEffect(() => {
    let cleanup = () => { }
    if (listIdToRemove && !pageState.fetching && !pageState.error && !pageState.updating) {
      setListIdToRemove(null)
      setPageState({ fetching: false, error: false, updating: true, lists: pageState.lists })
      const sub = todolistsIO.removeList(listIdToRemove)
        .pipe(
          mergeMap(() => todolistsIO.fetchTodoLists())
        ).subscribe(lists => {
          setPageState({ fetching: false, error: false, updating: false, lists })
        }, err => {
          setPageState({ fetching: false, error: true, msg: String(err) })
        })
      cleanup = () => sub.unsubscribe
    }
    return cleanup
  },
    // eslint-disable-next-line 
    [listIdToRemove, todolistsIO, listIdToRemove, !pageState.fetching && !pageState.error && !pageState.updating])


  return (
    <>
      {shouldRedirectId && <Redirect to={`/todolist/${shouldRedirectId}`} />}
      <Link to="/">home</Link>

      {
        pageState.fetching
          ? <h2>Wait, Fetching todoLists</h2>

          : pageState.error
            ? <div>
              <h1>Fetch Error: ${pageState.msg} </h1>
            </div>

            : <div>
              <div>
                <div className="row">
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Add todo list" onKeyDown={addHandler} />
                  </div>
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
              <Mask show={pageState.updating} />
            </div>
      }
    </>
  );
}

export default DashboardPage;
