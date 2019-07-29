import axios from './axios';
import configs from '../config';
import { Toast } from 'vant';

/**
 * 获取订单列表
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/custom/myAppeal.do';

const code = {
  success: '000',
  paramsError: '003',
  fail: '002',
  error: '',
  warning: ''
};

const msg = {
  request: '正在获取申诉订单列表...',
  success: '获取申诉订单的列表成功！',
  paramsError: '参数错误！',
  error: '获取申诉订单列表失败！',
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
        pageNum: params.pageNum,
        pageSize: params.pageSize
      },
      {
        method: 'POST' // 请求方法， GET 、POST ...
      },
      loading,
      msg['request']
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
