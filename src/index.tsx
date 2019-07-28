import io_doc from './io/document'
import React from 'react';
import ReactDOM from 'react-dom';
import App, { AppCtx } from './App';
import * as serviceWorker from './serviceWorker';
import { __RouterContext } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Events as AppEvents } from './App';
import { makeEmitter } from './helper/StrictEmitter';


export type GlobalEvents = AppEvents
export const emitter = makeEmitter<GlobalEvents>()
io_doc(emitter)

ReactDOM.render(
  <BrowserRouter>
    <AppCtx.Provider value={{ emitter }}>
      <App />
    </AppCtx.Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();

