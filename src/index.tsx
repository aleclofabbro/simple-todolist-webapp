import binder_doc from './binders/document'
import binder_TodoListPageFetch from './binders/TodoListPageFetch'
import io_TodoListPageFetch from './io/axios/TodoListPageFetch'
import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import App, { Events as AppEvents } from './App/AppComponent';
import * as serviceWorker from './serviceWorker';
import { __RouterContext } from 'react-router';
import Axios from 'axios'
import { BrowserRouter } from 'react-router-dom';
import { Events as TodoListEvents, TodolistPageCtx } from './pages/TodoList/TodoListPage';
import { makeEmitter } from '@alec/simple-todolist-common/dist/helper/StrictEmitter';
import { pageTitleByRouterCtx } from './helper/routes';

export type GlobalEvents =
  & AppEvents
  & TodoListEvents

  ;

Axios.get('/config.json').then(
  resp => {
    const baseURL = resp.data.api.baseUrl;
    const emitter = makeEmitter<GlobalEvents>()

    const axios = Axios.create({ baseURL })
    binder_doc(emitter, window)
    binder_TodoListPageFetch(emitter, io_TodoListPageFetch(axios))

    const Main = () => {
      const routerCtx = useContext(__RouterContext)

      useEffect(() => {
        const docTitle = pageTitleByRouterCtx(routerCtx)
        emitter.emit('changeDocumentTitle', docTitle)
      }, [routerCtx])
      return (
        <TodolistPageCtx.Provider value={{ emitter }}>
          <App {...{ emitter }} />
        </TodolistPageCtx.Provider>
      )
    }
    ReactDOM.render(<BrowserRouter><Main /></BrowserRouter>,
      document.getElementById('root')
    )

    serviceWorker.unregister();
  },
  err => alert(err)
)
