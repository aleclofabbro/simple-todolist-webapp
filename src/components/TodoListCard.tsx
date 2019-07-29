import React from 'react';
import { TodoList } from '@alec/simple-todolist-common/dist/types/Data';
import { Link } from 'react-router-dom';

export interface Props {
  todolist: TodoList
}

export const TodoListCard: React.FC<Props> = ({ todolist }) => {

  return (
    <>
      <div className="card col-lg-3 col-md-4 col-sm-6 col-xl-2">
        <div className="card-body">
          <span style={{ cursor: 'pointer' }} className="card-title">
            <Link to={`/todolist/${todolist.id}`}>{todolist.name}</Link>
          </span>
          <a href="#" className="float-right card-link">Delete</a>
        </div>
      </div>
    </>
  );
}
