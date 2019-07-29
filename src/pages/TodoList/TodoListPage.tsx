import React, { useEffect, useState, createContext, useContext } from 'react';
import { StrictEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import { TodoList, TodoListId } from '@alec/simple-todolist-common/dist/types/Data';
import { RouteComponentProps } from 'react-router';
import { } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import TodoListPanel from '../../components/TodoListPanel';
import { Link } from 'react-router-dom';
import { EventEmitter } from 'events';

type FetchResponse = TodoList | FetchErrorMsg
export interface Events {
  TodoListPage_FetchTodoList: TodoListId
  TodoListPage_CancelFetchTodoList: TodoListId
  TodoListPage_TodoListFetchResponse: FetchResponse
}

export type Emitter = StrictEmitter<Events>

export interface Ctx {
  emitter: Emitter
}

export const TodolistPageCtx = createContext<Ctx>({
  emitter: new EventEmitter()
})

type FetchErrorMsg = string
interface AbsFetchStatus<Fetching extends boolean, IsError extends boolean> { error: IsError, fetching: Fetching }
interface Fetching extends AbsFetchStatus<true, false> { }
interface Fetched extends AbsFetchStatus<false, false> { list: TodoList }
interface FetchError extends AbsFetchStatus<false, true> { msg: FetchErrorMsg }
type FetchStatus =
  | Fetching
  | Fetched
  | FetchError
const TodoListPage: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const ctx = useContext(TodolistPageCtx)
  const { emitter } = ctx

  const listId: TodoListId = match.params.id
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ fetching: true, error: false })

  useEffect(() => {
    setFetchStatus({ fetching: true, error: false })
    emitter.emit('TodoListPage_FetchTodoList', listId)
    return () => {
      emitter.emit('TodoListPage_CancelFetchTodoList', listId)
    }
  }, [listId])

  useEffect(() => {
    const set = (resp: FetchResponse) => {
      if ('string' === typeof resp) {
        setFetchStatus({ fetching: false, error: true, msg: resp })
      } else {
        setFetchStatus({ fetching: false, error: false, list: resp })
      }
    }
    emitter.addListener('TodoListPage_TodoListFetchResponse', set)
    return () => {
      emitter.removeListener('TodoListPage_TodoListFetchResponse', set)
    }
  }, [listId])

  const list = !fetchStatus.fetching && !fetchStatus.error && fetchStatus.list
  const errorMsg = !fetchStatus.fetching && fetchStatus.error && fetchStatus.msg
  const fetching = fetchStatus.fetching
  return (
    <>
      <Link to="/dashboard">dashboard</Link>
      {fetching && <h2>Wait, Fetching todoList#{listId}</h2>}
      {list && <TodoListPanel todoList={list} />}
      {errorMsg && <div>
        <h1>Fetch Error: ${errorMsg} </h1>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>}
    </>
  );
}

export default TodoListPage;
