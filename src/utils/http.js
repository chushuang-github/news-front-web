import axios from "axios";

// axios的全局配置
axios.defaults.baseURL = 'http://localhost:5000'

// 请求拦截器
axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(data => {
  return data
}, err => {
  return Promise.reject(err)
})