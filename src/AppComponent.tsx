import React, { useContext } from 'react';
import { Route, Link } from "react-router-dom";
import { Switch } from 'react-router';
// import { TodoListIdRegExp } from '../types/Data';
import DashboardPage from './pages/DashboardPage';
import TodoListPage from './pages/TodoListPage';
import { AppCtx } from './ctx';





const App: React.FC = () => {
  const appCtx = useContext(AppCtx)


  return (
    <>
      <h1 className="text-center">{appCtx.title}</h1>
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
              path={`/todolist/:id`}
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
