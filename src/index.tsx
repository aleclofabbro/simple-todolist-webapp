// import TodoListIO from './io/axios/AxiosTodoListIO'
import MemTodoListIO from './io/inmemory/MemTodoListIO'
import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import App from './AppComponent';
import * as serviceWorker from './serviceWorker';
import { __RouterContext } from 'react-router';
import Axios from 'axios'
import { BrowserRouter } from 'react-router-dom';
// import { makeEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import { pageTitleByRouterCtx } from './helper/routes';
import * as Ctxs from './ctx';



Axios.get('/config.json').then(
  _resp => {
    // const emitter = makeEmitter<GlobalEvents>()

    /* 
    const baseURL = resp.data.api.baseUrl;
    const axios = Axios.create({ baseURL })
    const axiosTodolistsIO = TodoListIO(axios)
    */

    const memTodolistsIO = MemTodoListIO()

    const Main = () => {
      const routerCtx = useContext(__RouterContext)
      const [title, setTitle] = useState('')
      useEffect(() => {
        const docTitle = pageTitleByRouterCtx(routerCtx)
        window.document.title = docTitle
        setTitle(docTitle)
      }, [routerCtx])

      return (
        <Ctxs.TodoListIOCtx.Provider value={memTodolistsIO}>
          <Ctxs.AppCtx.Provider value={{ title }}>
            <App />
          </Ctxs.AppCtx.Provider>
        </Ctxs.TodoListIOCtx.Provider>
      )
    }

    ReactDOM.render(<BrowserRouter><Main /></BrowserRouter>,
      document.getElementById('root')
    )

    serviceWorker.unregister();
  },
  err => alert(err)
)
