import { TodoListIO } from '../../types/TodoListIO';
import { TodoList } from '../../types/Data';
import { from, throwError, Observable } from 'rxjs';
import { delay, tap } from 'rxjs/operators';


const newId = () => Number(String(Math.random()).substr(2)).toString(36)
export default (cfg = {
  lag: 100,
  max: 500,
  errPct: 0
}): TodoListIO => {
  const ITEMID = 'TODOLISTS_DB'

  const obsFromValueWithDelayAndMaybeErrorAndSave = <T>(data: T): Observable<T> => {
    const shouldThrow = Math.random() < cfg.errPct
    const outObs = shouldThrow
      ? (throwError('some Error occoured') as Observable<T>)
      : from([data]).pipe(tap(save))

    return outObs.pipe(
      delay(cfg.max * Math.random() + cfg.lag)
    )
  }
  const savedStr = localStorage.getItem(ITEMID)
  const db: Record<string, TodoList> = savedStr ? JSON.parse(savedStr) : {
  }
  const save = () => localStorage.setItem(ITEMID, JSON.stringify(db))

  return {
    addTodoRowToList: (id, text) => {
      const todolist: TodoList | void = db[id]
      if (!todolist) {
        return throwError('404')
      } else {
        db[id] = { ...todolist, todos: [{ id: newId(), done: false, text }, ...todolist.todos] }
        return obsFromValueWithDelayAndMaybeErrorAndSave(db[id])
      }
    },

    setDoneFlag: (listId, rowIds, done) => {
      const todolist: TodoList | void = db[listId]
      if (!todolist) {
        return throwError('404')
      } else {
        const todos = todolist.todos.map(todo => rowIds.includes(todo.id) ? { ...todo, done } : todo)
        db[listId] = { ...todolist, todos }
        return obsFromValueWithDelayAndMaybeErrorAndSave(db[listId])
      }
    },

    removeTodos: (listId, rowIds) => {
      const todolist: TodoList | void = db[listId]
      if (!todolist) {
        return throwError('404')
      } else {
        const todos = todolist.todos.filter(todo => !rowIds.includes(todo.id))
        db[listId] = { ...todolist, todos }
        return obsFromValueWithDelayAndMaybeErrorAndSave(db[listId])
      }
    },

    removeList: (listId) => {
      const todolist: TodoList | void = db[listId]
      if (!todolist) {
        return throwError('404')
      } else {
        delete db[listId]
        return obsFromValueWithDelayAndMaybeErrorAndSave(true)
      }
    },

    fetchTodoList: id => {
      const todolist: TodoList | void = db[id]
      return todolist ? obsFromValueWithDelayAndMaybeErrorAndSave(todolist) : throwError('404')
    },

    addTodoList: (name) => {
      const id = newId()
      db[id] = {
        id,
        name,
        todos: []
      }
      return obsFromValueWithDelayAndMaybeErrorAndSave(id)

    },

    fetchTodoLists: () => {
      const lists = Object.keys(db)
        .reduce<TodoList[]>(
          (lists, key) => lists.concat(db[key]),
          [] as TodoList[])

      return obsFromValueWithDelayAndMaybeErrorAndSave(lists)
    }

  }
}


