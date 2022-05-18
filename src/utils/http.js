import axios from "axios";
import { store } from '../redux/store'
import { loadingAction } from '../redux/action-creator'

// axios的全局配置
axios.defaults.baseURL = 'http://localhost:5000'

// 请求拦截器
axios.interceptors.request.use(config => {
  // 加载中效果的loading值
  store.dispatch(loadingAction(true))
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(data => {
  store.dispatch(loadingAction(false))
  return data
}, err => {
  store.dispatch(loadingAction(false))
  return Promise.reject(err)
})