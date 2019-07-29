import React from 'react'
import { TodoList } from '@alec/simple-todolist-common/dist/types/Data';
import { TodoCard } from './TodoCard';
import { } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';



export interface Props {
  todoList: TodoList
}

const TodoListPanel: React.FC<Props> = ({ todoList }) => {
  return (
    <>
      <div className="row">

        <div className="col-sm-12 offset-md-2 col-md-8 offset-lg-3 col-lg-6 ">
          <div className="row">
            <div className="col-12">
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="add" />
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-12 mb-5">
              <button className="btn btn-success">mark all as done</button>
              <button className="btn btn-warning">delete done</button>
            </div>
          </div>
          {
            todoList.todos.map((todo, index) =>
              <div key={index} className="row">
                <TodoCard todo={todo} />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default TodoListPanel;
