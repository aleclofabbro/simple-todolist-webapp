import React, { useContext } from 'react';
import { Route, Link } from "react-router-dom";
import { __RouterContext, RouteComponentProps, Switch } from 'react-router';
import { TodoListIdRegExp } from './types/Data';

const App: React.FC = () => {
  const routerCtx = useContext(__RouterContext)
  return (
    < >
      <h1 className="text-center">{pageTitleByRouterCtx(routerCtx)}</h1>
      <div className="main">
        <div className="page">
          <Switch>
            <Route
              path="/dashboard"
              render={() => <div>dashboard <Link to="/todolist/3443" >todo</Link>  </div>}
            />
            <Route
              path={`/todolist/:id(${TodoListIdRegExp.source})`}
              render={(_) => <div>todolist:{_.match.params.id} <Link to="/dashboard" >dash</Link></div>}
            />
            <Route render={(_) => <div>- 404 - <Link to="/dashboard" >dash</Link></div>} />
          </Switch>
        </div>
      </div>
    </ >
  );
}

function pageTitleByRouterCtx(routerCtx: RouteComponentProps) {
  const _title = Object.keys(regexLocationPathTitle).find((key) => {
    const reg = regexLocationPathTitle[key as keyof (typeof regexLocationPathTitle)]
    return !!routerCtx.location.pathname.match(reg)
  })
  const title = `TodoListApp ${_title ? ` | ${_title}` : ``}`
  window.document.title = title
  return title
}
const regexLocationPathTitle = {
  'Dashboard': /^\/dashboard$/,
  'TodoList': new RegExp(`^\/todolist\/${TodoListIdRegExp.source}$`)
}

export default App;
