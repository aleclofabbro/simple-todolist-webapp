import React, { useEffect, useState, useContext } from 'react';
import { TodoList, TodoListId, TodoRowId } from '../types/Data';
import { RouteComponentProps } from 'react-router';
import TodoListPanel from '../components/TodoListPanel';
import { Link } from 'react-router-dom';
import { TodoListIOCtx } from '../ctx';
import { Mask } from '../components/Mask';

type PageState =
  | { status: 1 }
  | { status: 2, errorMsg: string }
  | { status: 3, updating: boolean, list: TodoList }


const TodoListPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const todolistsIO = useContext(TodoListIOCtx)
  const listId: TodoListId = match.params.id


  const [pageState, setPageState] = useState<PageState>({ status: 1 })

  useEffect(() => {
    const sub = todolistsIO.fetchTodoList(listId)
      .subscribe(list => {
        setPageState({ status: 3, updating: false, list })
      }, err => {
        setPageState({ status: 2, errorMsg: String(err) })
      })
    return () => sub.unsubscribe()
  },
    // eslint-disable-next-line 
    [listId, todolistsIO])

  const [newTodoRow, setNewTodoRow] = useState<string | null>(null)
  useEffect(() => {
    if (pageState.status === 3 && !pageState.updating && newTodoRow) {

      setPageState({ status: 3, updating: true, list: pageState.list })
      const sub = todolistsIO.addTodoRowToList(listId, newTodoRow)
        .subscribe(list => setPageState({ status: 3, updating: false, list }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setNewTodoRow(null)
        )
      return () => sub.unsubscribe()
    }
    return
  },
    // eslint-disable-next-line 
    [listId, todolistsIO, newTodoRow])

  const [removeTodos, setRemoveTodos] = useState<TodoRowId[]>([])
  useEffect(() => {
    if (pageState.status === 3 && !pageState.updating && removeTodos.length) {
      setPageState({ status: 3, updating: true, list: pageState.list })
      const sub = todolistsIO.removeTodos(listId, removeTodos)
        .subscribe(list => setPageState({ status: 3, updating: false, list }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setRemoveTodos([])
        )
      return () => sub.unsubscribe()
    }
    return
  },
    // eslint-disable-next-line 
    [listId, todolistsIO, removeTodos])


  const [todosFlagsToSet, setTodosFlagsToSet] = useState<{ rowIds: TodoRowId[], flag: boolean } | null>(null)
  useEffect(() => {
    if (pageState.status === 3 && !pageState.updating && todosFlagsToSet) {
      setPageState({ status: 3, updating: true, list: pageState.list })
      const sub = todolistsIO.setDoneFlag(listId, todosFlagsToSet.rowIds, todosFlagsToSet.flag)
        .subscribe(list => setPageState({ status: 3, updating: false, list }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setTodosFlagsToSet(null)
        )
      return () => sub.unsubscribe()
    }
    return
  },
    // eslint-disable-next-line 
    [listId, todolistsIO, todosFlagsToSet])


  return (
    <>
      <Link to="/dashboard">dashboard</Link>

      {
        pageState.status === 1
          ? <h2>Wait, Fetching todoList#{listId}</h2>
          : pageState.status === 2
            ? <div>
              <h1>Fetch Error: ${pageState.errorMsg} </h1>
              <Link to="/dashboard">Back to Dashboard</Link>
            </div>
            : <>
              <TodoListPanel {...{
                todoList: pageState.list,
                addTodoRowToList: setNewTodoRow,
                removeTodos: setRemoveTodos,
                setDoneFlags: (rowIds, flag) => setTodosFlagsToSet({ rowIds, flag })
              }} />
              <Mask show={pageState.updating} />
            </>
      }
    </>
  );
}

export default TodoListPage;
