import { TodoListIdRegExp } from '../types/Data';
import { RouteComponentProps } from 'react-router';

export function pageTitleByRouterCtx(routerCtx: RouteComponentProps) {
  const _title = Object.keys(regexLocationPathTitle).find((key) => {
    const reg = regexLocationPathTitle[key as keyof (typeof regexLocationPathTitle)]
    return !!routerCtx.location.pathname.match(reg)
  })
  const title = `TodoListApp ${_title ? ` | ${_title}` : ``}`
  return title
}
const regexLocationPathTitle = {
  'Dashboard': /^\/dashboard$/,
  'TodoList': new RegExp(`^/todolist/${TodoListIdRegExp.source}$`)
}