import { createContext } from 'react';
import { TodoListIO } from './types/TodoListIO';
import { AppCtxType } from './types/AppCtx';

const unimplemented = new Proxy({}, {
  get: (_target, prop, _receiver) => () => { throw new Error(`${String(prop)} Not Implemented`) }
})

export const TodoListIOCtx = createContext<TodoListIO>(unimplemented as TodoListIO)
export const AppCtx = createContext<AppCtxType>(unimplemented as AppCtxType)