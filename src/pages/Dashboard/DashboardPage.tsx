import React, { useContext, createContext } from 'react';
import { StrictEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import { TodoList } from '@alec/simple-todolist-common/dist/types/Data';
import { TodoListCard } from '../../components/TodoListCard';
import { RouteComponentProps } from 'react-router';
import { EventEmitter } from 'events';
import { Link } from 'react-router-dom';

export interface Events {
}

export type Emitter = StrictEmitter<Events>


export interface Ctx {
  emitter: Emitter
  todolists: TodoList[]
}

export const DashCtx = createContext<Ctx>({
  emitter: new EventEmitter(),
  todolists: [{
    id: '1234',
    name: 'My first TodoList',
    todos: [{ done: true, text: 'restì' }]
  }]
})


const DashboardPage: React.FC<RouteComponentProps> = (_) => {
  const ctx = useContext(DashCtx)

  return (
    <>
      <div>
        <Link to="/">home</Link>
        <div className="row">
          <div className="input-group mb-3">

            <input type="text" className="form-control" placeholder="Add todo list" />
          </div>
        </div>
      </div>
      <div className="row">
        {
          ctx.todolists.map(todolist => <TodoListCard todolist={todolist} />)
        }
      </div>
    </>
  );
}

export default DashboardPage;
