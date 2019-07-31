import React from 'react'
import { TodoList, TodoRowId } from '../types/Data';
import { TodoCard } from './TodoCard';



export interface Props {
  todoList: TodoList,
  addTodoRowToList: (row: string) => unknown
  setDoneFlags: (todoIds: TodoRowId[], flag: boolean) => unknown
  removeTodos: (todoIds: TodoRowId[]) => unknown

}

const TodoListPanel: React.FC<Props> = ({ addTodoRowToList, todoList, setDoneFlags, removeTodos }) => {

  const undone = todoList.todos.filter(_ => !_.done)
  const done = todoList.todos.filter(_ => _.done)

  const allDone = () => undone.length && setDoneFlags(undone.map(_ => _.id), true)
  const delDone = () => done.length && removeTodos(done.map(_ => _.id))


  const addTodoHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodoRowToList(e.currentTarget.value)
      e.currentTarget.value = ''
    }
  }

  return (
    <>
      <div className="row">

        <div className="col-sm-12 offset-md-2 col-md-8 offset-lg-3 col-lg-6 ">
          <h2 className="text-center">{todoList.name}</h2>
          <div className="row">
            <div className="col-12">
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="add" onKeyDown={addTodoHandler} />
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-12 mb-5">
              <button onClick={allDone} className="btn btn-success" disabled={!undone.length}>mark all as done</button>
              <button onClick={delDone} className="btn btn-warning" disabled={!done.length}>delete done</button>
            </div>
          </div>
          {
            todoList.todos.map((todo, index) =>
              <div key={index} className="row">
                <TodoCard key={todo.id} {...{
                  todo,
                  remove: () => removeTodos([todo.id]),
                  toggleDone: () => setDoneFlags([todo.id], !todo.done),
                }} />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default TodoListPanel;
