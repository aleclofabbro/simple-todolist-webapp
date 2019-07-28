import React, { useContext, useState, useEffect, createContext } from 'react';
import { Route, Link } from "react-router-dom";
import { __RouterContext, Switch } from 'react-router';
import { TodoListIdRegExp } from '../types/Data';
import { pageTitleByRouterCtx } from '../helper/routes';
import { makeEmitter } from '../helper/StrictEmitter';
import { Emitter, Events } from './Events';

export interface Ctx {
  emitter: Emitter
}

export const AppCtx = createContext<Ctx>({
  emitter: makeEmitter<Events>()
})


const App: React.FC = () => {
  const ctx = useContext(AppCtx)
  const routerCtx = useContext(__RouterContext)
  const [title, setTitle] = useState('Todo App')

  useEffect(() => {
    const docTitle = pageTitleByRouterCtx(routerCtx)
    ctx.emitter.emit('changeDocumentTitle', docTitle)
  }, [routerCtx])

  useEffect(() => {
    ctx.emitter.addListener('changeDocumentTitle', setTitle)
    return () => { ctx.emitter.removeListener('changeDocumentTitle', setTitle) }
  }, [])

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
              render={() => <div>dashboard <Link to="/todolist/3443" >todo</Link>  </div>}
            />
            <Route
              exact
              path={`/todolist/:id(${TodoListIdRegExp.source})`}
              render={(_) => <div>todolist:{_.match.params.id} <Link to="/dashboard" >dash</Link></div>}
            />
            <Route render={(_) => <div>- 404 - <Link to="/dashboard" >dashboard</Link></div>} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default App;
