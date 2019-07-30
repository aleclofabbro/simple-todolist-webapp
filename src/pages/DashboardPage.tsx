import React, { useState, useEffect, useContext } from 'react';
import { TodoListCard } from '../components/TodoListCard';
import { RouteComponentProps, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { TodoListIOCtx } from '../ctx';
import { TodoList, TodoListId } from '../types/Data';

type PageState =
  | { fetching: true, error: false }
  | { fetching: false, error: true, msg: string }
  | { fetching: false, error: false, lists: TodoList[] }


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
        setPageState({ fetching: false, error: false, lists })
      }, err => {
        setPageState({ fetching: false, error: true, msg: String(err) })
      })
    return () => sub.unsubscribe()
  }, [])


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

            : <>
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
                    todolist: todolist
                  }} />)
                }
              </div>
            </>
      }
    </>
  );
}

export default DashboardPage;
