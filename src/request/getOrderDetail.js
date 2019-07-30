import axios from './axios';
import configs from '../config';
import { Message } from 'store-vue-ui';
/**
 * 获取订单详情
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/custom/appealDetail.do';

const code = {
  success: '000',
  paramsError: '003',
  fail: '002',
  error: '',
  warning: ''
};

const msg = {
  request: '正在获取订单申诉详情...',
  success: '获取订单详情成功！',
  paramsError: '参数错误！',
  error: '获取订单详情失败！',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 1) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        accessToken: params.accessToken,
        appId: params.appId,
        orderId: params.orderId
      },
      {
        method: 'POST' // 请求方法， GET 、POST ...
      },
      loading,
      msg['request']
    );
    console.log(promise);

    promise.then(response => {
      console.log(response);
      if (response['code'] === code['success']) {
        resolve(response['data']);
      } else if (response['code'] === code['paramsError']) {
        Message.danger(msg['paramsError']);
        reject(response);
      } else if (response['code'] === code['fail']) {
        Message.danger(response['msg']);
        reject(response);
      } else {
        Message.danger(msg['error']);
        reject(response);
      }
    });

    promise.catch(error => {
      reject(error);
    });
  });
}
