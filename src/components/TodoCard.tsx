import './Todo.css';
import React from 'react';
import { Todo } from '@alec/simple-todolist-common/dist/types/Data';

export interface Props {
  todo: Todo
}

export const TodoCard: React.FC<Props> = ({ todo }) => {

  return (
    <>
      <div className={`col-12 todo shadow p-3 mb-3 bg-${todo.done ? 'success' : 'light'} rounded`}>
        <i style={{ cursor: `pointer` }} className={`float-left fa-2x far fa-${todo.done ? 'check-' : ''}circle`}></i>
        <span>{todo.text}</span>
        <i style={{ cursor: `pointer` }} className="del-todo float-right fa-2x fas fa-times"></i>
      </div>
    </>
  );
}
