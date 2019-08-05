import axios from './axios';
import configs from '../config';
import { Message } from 'store-vue-ui';

/**
 * 提现
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/pay/recharge.do';

const code = {
  success: '000',
  error: '',
  warning: ''
};

const msg = {
  paramsError: '参数错误！',
  error: '充值失败，请稍后重试！',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 2) {
  return new Promise((resolve, reject) => {
    let promise = axios(url, params, {}, loading, msg['requst']);

    promise.then(response => {
      let isSuccess = Boolean(response['code'] === code['success']);

      if (isSuccess) {
        Message.success(msg['success']);
        resolve(response);
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
