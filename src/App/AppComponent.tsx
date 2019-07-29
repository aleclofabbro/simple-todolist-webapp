import React, { useEffect, useState } from 'react';
import { Route, Link } from "react-router-dom";
import { Switch } from 'react-router';
import { TodoListIdRegExp } from '@alec/simple-todolist-common/dist/types/Data';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import TodoListPage from '../pages/TodoList/TodoListPage';
import { StrictEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';

export interface Events {
  changeDocumentTitle: string
}

export type Emitter = StrictEmitter<Events>


export interface Props {
  emitter: Emitter
}

const App: React.FC<Props> = ({ emitter }) => {
  const [title, setTitle] = useState<string>()

  useEffect(() => {
    emitter.addListener('changeDocumentTitle', setTitle)
    return () => { emitter.removeListener('changeDocumentTitle', setTitle) }
  }, [emitter])

  return (
    <>
      <h1 className="text-center">{title}</h1>
      <div className="main">
        <div className="page">
          <Switch>
            <Route exact path="/" render={(_) => <h1>- Welecome - <Link to="/dashboard" >dashboard</Link></h1>} />
            <Route
              exact
              path="/dashboard"
              component={DashboardPage}
            />
            <Route
              exact
              path={`/todolist/:id(${TodoListIdRegExp.source})`}
              component={TodoListPage}
            />
            <Route render={(_) => <div>- 404 - <Link to="/dashboard" >dashboard</Link></div>} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default App;
