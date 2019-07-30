import React from 'react';
import { TodoList } from '../types/Data';
import { Link } from 'react-router-dom';

export interface Props {
  todolist: TodoList,
  deleteList: () => unknown
}

export const TodoListCard: React.FC<Props> = ({ todolist, deleteList }) => {

  return (
    <>
      <div className="card col-lg-3 col-md-4 col-sm-6 col-xl-2">
        <div className="card-body">
          <h4 style={{ cursor: 'pointer' }} className="card-title">
            <Link to={`/todolist/${todolist.id}`}>{todolist.name}</Link>
          </h4>
          <p className="card-text">
            Todos: {todolist.todos.length}
          </p>
          <p className="card-text">
            Done: {todolist.todos.filter(_ => _.done).length}
          </p>
          <button onClick={deleteList} style={{ cursor: 'pointer' }} className="float-right card-link btn btn-sm btn-danger">Delete</button>
        </div>
      </div>
    </>
  );
}
