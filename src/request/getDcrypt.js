import axios from './axios';
import configs from '../config';
import { Toast } from 'vant';

/**
 * 获取解密数据 - 提现和充值的加密字符串
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/co/rsa.do';

const code = {
  success: '000',
  paramsError: '003',
  fail: '002',
  error: '',
  warning: ''
};

const msg = {
  success: '解析数据成功！',
  paramsError: '参数错误！',
  error: '解析数据失败！',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 2) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        token: params.token
      },
      {},
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
