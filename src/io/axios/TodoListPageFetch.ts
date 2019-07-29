import Axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { AxiosInstance } from 'axios';
import { TodoListPageFetchIO, CancelableFetchHandler } from '../TodoListPageFetchTypes';

export default (axios: AxiosInstance): TodoListPageFetchIO => {
  const withCancel = withCancelFactory(axios)
  return {
    fetchTodoList: id => withCancel({
      method: 'GET',
      url: `todolists/${id}`
    })
  }
}
const withCancelFactory = (axios: AxiosInstance) => <T>(config: AxiosRequestConfig): CancelableFetchHandler<T> => {
  const source = Axios.CancelToken.source()
  const response = axios.request<T>(config)
    .then(
      resp => resp.data,
      (err: AxiosError) => Promise.reject(err.message)
    )
  return {
    response,
    cancel: () => source.cancel()
  }
}
