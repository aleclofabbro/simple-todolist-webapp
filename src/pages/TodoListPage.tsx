import React, { useEffect, useState, useContext } from 'react';
import { TodoList, TodoListId, TodoRowId } from '../types/Data';
import { RouteComponentProps } from 'react-router';
import TodoListPanel from '../components/TodoListPanel';
import { Link } from 'react-router-dom';
import { TodoListIOCtx } from '../ctx';
import { Mask } from '../components/Mask';

type PageState =
  | { fetching: true, error: false }
  | { fetching: false, error: true, msg: string }
  | { fetching: false, error: false, updating: boolean, list: TodoList }


const TodoListPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const todolistsIO = useContext(TodoListIOCtx)
  const listId: TodoListId = match.params.id


  const [pageState, setPageState] = useState<PageState>({ fetching: true, error: false })

  useEffect(() => {
    const sub = todolistsIO.fetchTodoList(listId)
      .subscribe(list => {
        setPageState({ fetching: false, error: false, updating: false, list })
      }, err => {
        setPageState({ fetching: false, error: true, msg: String(err) })
      })
    return () => sub.unsubscribe()
  },
    // eslint-disable-next-line 
    [listId, todolistsIO])

  const [newTodoRow, setNewTodoRow] = useState<string | null>(null)
  useEffect(() => {
    let cleanup = () => { }
    if (newTodoRow && !pageState.fetching && !pageState.error && !pageState.updating) {
      setNewTodoRow(null)
      setPageState({ fetching: false, error: false, updating: true, list: pageState.list })
      const sub = todolistsIO.addTodoRowToList(listId, newTodoRow)
        .subscribe(list => {
          setPageState({ fetching: false, error: false, updating: false, list })
        }, err => {
          setPageState({ fetching: false, error: true, msg: String(err) })
        })
      cleanup = () => sub.unsubscribe
    }
    return cleanup
  },
    // eslint-disable-next-line 
    [listId, todolistsIO, newTodoRow, !pageState.fetching && !pageState.error && !pageState.updating])

  const [removeTodos, setRemoveTodos] = useState<TodoRowId[]>([])
  useEffect(() => {
    let cleanup = () => { }
    if (removeTodos.length && !pageState.fetching && !pageState.error && !pageState.updating) {
      setRemoveTodos([])
      setPageState({ fetching: false, error: false, updating: true, list: pageState.list })
      const sub = todolistsIO.removeTodos(listId, removeTodos)
        .subscribe(list => {
          setPageState({ fetching: false, error: false, updating: false, list })
        }, err => {
          setPageState({ fetching: false, error: true, msg: String(err) })
        })
      cleanup = () => sub.unsubscribe
    }
    return cleanup
  },
    // eslint-disable-next-line 
    [listId, todolistsIO, removeTodos.length, !pageState.fetching && !pageState.error && !pageState.updating])


  const [todosFlagsToSet, setTodosFlagsToSet] = useState<{ rowIds: TodoRowId[], flag: boolean } | null>(null)
  useEffect(() => {
    let cleanup = () => { }
    if (todosFlagsToSet && !pageState.fetching && !pageState.error && !pageState.updating) {
      setTodosFlagsToSet(null)
      setPageState({ fetching: false, error: false, updating: true, list: pageState.list })
      const sub = todolistsIO.setDoneFlag(listId, todosFlagsToSet.rowIds, todosFlagsToSet.flag)
        .subscribe(list => {
          setPageState({ fetching: false, error: false, updating: false, list })
        }, err => {
          setPageState({ fetching: false, error: true, msg: String(err) })
        })
      cleanup = () => sub.unsubscribe
    }
    return cleanup
  },
    // eslint-disable-next-line 
    [listId, todolistsIO, todosFlagsToSet, !pageState.fetching && !pageState.error && !pageState.updating])


  return (
    <>
      <Link to="/dashboard">dashboard</Link>

      {
        pageState.fetching
          ? <h2>Wait, Fetching todoList#{listId}</h2>
          : pageState.error
            ? <div>
              <h1>Fetch Error: ${pageState.msg} </h1>
              <Link to="/dashboard">Back to Dashboard</Link>
            </div>
            : <div style={{ position: "relative" }}>
              <TodoListPanel {...{
                todoList: pageState.list,
                addTodoRowToList: setNewTodoRow,
                removeTodos: setRemoveTodos,
                setDoneFlags: (rowIds, flag) => setTodosFlagsToSet({ rowIds, flag })
              }} />
              <Mask show={pageState.updating} />
            </div>
      }
    </>
  );
}

export default TodoListPage;
