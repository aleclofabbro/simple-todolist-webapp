import './Todo.css';
import React from 'react';
import { Todo } from '../types/Data';

export interface Props {
  todo: Todo
  toggleDone: () => unknown
  remove: () => unknown
}

export const TodoCard: React.FC<Props> = ({ todo, toggleDone: markDone, remove }) => {

  return (
    <>
      <div className={`col-12 todo shadow p-3 mb-3 bg-${todo.done ? 'success' : 'light'} rounded`}>
        <i onClick={markDone} style={{ cursor: `pointer` }} className={`float-left fa-2x far fa-${todo.done ? 'check-' : ''}circle`}></i>
        <span>{todo.text}</span>
        <i onClick={remove} style={{ cursor: `pointer` }} className="del-todo float-right fa-2x fas fa-times"></i>
      </div>
    </>
  );
}
