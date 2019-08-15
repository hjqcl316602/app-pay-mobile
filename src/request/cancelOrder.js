/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 15:42:03
 * @LastEditTime: 2019-08-15 16:30:18
 * @LastEditors: Please set LastEditors
 */
import axios from './axios';
import configs from '../config';
import { Message } from 'store-vue-ui';

/**
 * 提现
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/pay/withdrawCancel.do';

const code = {
  success: '000',
  error: '',
  warning: ''
};

const msg = {
  requst: '订单取消中...',
  success: '订单已取消',
  paramsError: '参数错误！',
  error: '订单取消失败，请重试',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 2) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        accessToken: params.accessToken
      },
      {},
      loading,
      msg['requst']
    );

    promise.then(response => {
      let isSuccess = Boolean(response['code'] === code['success']);

      if (isSuccess) {
        Message.success(msg['success']);
        resolve(response['data']);
      } else {
        Message.danger(msg['error']);
        reject(response);
      }
    });

    promise.catch(error => {
      Message.warning(msg['warning']);
      reject(error);
    });
  });
}
