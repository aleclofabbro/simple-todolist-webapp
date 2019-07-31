import React, { useEffect, useState, useContext } from 'react';
import { TodoList, TodoListId, TodoRowId } from '../types/Data';
import { RouteComponentProps } from 'react-router';
import TodoListPanel from '../components/TodoListPanel';
import { Link } from 'react-router-dom';
import { TodoListIOCtx } from '../ctx';

type PageState =
  | { status: 1 }
  | { status: 2, errorMsg: string }
  | { status: 3, list: TodoList }


const TodoListPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const todolistsIO = useContext(TodoListIOCtx)
  const listId: TodoListId = match.params.id


  const [pageState, setPageState] = useState<PageState>({ status: 1 })

  useEffect(() => {
    const sub = todolistsIO.fetchTodoList(listId)
      .subscribe(list => {
        setPageState({ status: 3, list })
      }, err => {
        setPageState({ status: 2, errorMsg: String(err) })
      })
    return () => sub.unsubscribe()
  }, [listId, todolistsIO])

  const [newTodoRow, setNewTodoRow] = useState<string | null>(null)
  useEffect(() => {
    if (pageState.status === 3 && newTodoRow) {
      const sub = todolistsIO.addTodoRowToList(listId, newTodoRow)
        .subscribe(list => setPageState({ status: 3, list }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setNewTodoRow(null)
        )
      return () => sub.unsubscribe()
    }
    return
  }, [listId, todolistsIO, newTodoRow, pageState.status])

  const [removeTodos, setRemoveTodos] = useState<TodoRowId[]>([])
  useEffect(() => {
    if (pageState.status === 3 && removeTodos.length) {
      const sub = todolistsIO.removeTodos(listId, removeTodos)
        .subscribe(list => setPageState({ status: 3, list }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setRemoveTodos([])
        )
      return () => sub.unsubscribe()
    }
    return
  }, [listId, todolistsIO, removeTodos, pageState.status])


  const [todosFlagsToSet, setTodosFlagsToSet] = useState<{ rowIds: TodoRowId[], flag: boolean } | null>(null)
  useEffect(() => {
    if (pageState.status === 3 && todosFlagsToSet) {
      const sub = todolistsIO.setDoneFlag(listId, todosFlagsToSet.rowIds, todosFlagsToSet.flag)
        .subscribe(list => setPageState({ status: 3, list }),
          err => setPageState({ status: 2, errorMsg: String(err) }),
          () => setTodosFlagsToSet(null)
        )
      return () => sub.unsubscribe()
    }
    return
  }, [listId, todolistsIO, todosFlagsToSet, pageState.status])


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
            </>
      }
    </>
  );
}

export default TodoListPage;
