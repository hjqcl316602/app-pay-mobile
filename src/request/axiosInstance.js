import axios from 'axios'
import qs from 'qs'
import {
  Toast
} from "vant"


let msg = {
  request: '请求失败，请检查参数！',
  noNetwork: '网络错误，请检查网络！',
  timeOut: '请求超时，请重新刷新页面！',
  aborted: '连接中断，请重试！',
  unKnown: '异常，未知错误，请重试！',
}


let instance = axios.create({
  url: '',
  method: 'post',
  baseURL: '',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'user-type': 'admin'
  },
  withCredentials: true,
  responseType: 'json',
  maxContentLength: 2000,
  timeout: 30 * 1000,
})

instance.interceptors.request.use(res => {

  res['data'] = qs.stringify(res['data'])
  return res
}, err => {
  Toast(msg['request'])
})

instance.interceptors.response.use(res => {

  let status = res['status']
  if (status >= 200 || status <= 300) {
    return Promise.resolve(res)
  } else {
    return Promise.reject(res)
  }

}, err => {
  let errMsg = err['message']

  if (errMsg.includes('timeout')) {
    Toast(msg['timeOut'])
  } else if (errMsg.includes('Network')) {
    Toast(msg['noNetwork'])
  } else if (errMsg.includes('aborted')) {
    Toast(msg['aborted'])
  } else {
    Toast(msg['unKnown'])
  }

  return Promise.reject(errMsg)

})

export default instance