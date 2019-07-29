import axios from './axios';
import configs from '../config';
import { Toast } from 'vant';

/**
 * 获取订单支付状态列表
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/pay/paySuccess.do';

const code = {
  success: '000',
  paramsError: '003',
  fail: '002',
  error: '',
  warning: ''
};

const msg = {
  success: '获取订单状态成功！',
  paramsError: '参数错误！',
  error: '获取订单状态失败！',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 1) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        accessToken: params.accessToken
      },
      {
        method: 'POST' // 请求方法， GET 、POST ...
      },
      loading
    );

    promise.then(response => {
      if (response['code'] === code['success']) {
        resolve(response['data']);
      } else if (response['code'] === code['paramsError']) {
        Toast(msg['paramsError']);
        reject(response);
      } else if (response['code'] === code['fail']) {
        Toast(response['msg']);
        reject(response);
      } else {
        Toast(msg['error']);
        reject(response);
      }
    });

    promise.catch(error => {
      reject(error);
    });
  });
}
