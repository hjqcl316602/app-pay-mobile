import axios from './axios';
import configs from '../config';
import { Check } from 'store-es';
import { Message } from 'store-vue-ui';
const url = configs['HTTP_REQUEST'] + '/custom/appeal.do';

const code = {
  success: '000',
  paramsError: '003',
  fail: '002',
  error: '',
  warning: ''
};

const msg = {
  request: '提交申诉中...',
  success: '申诉成功，客服稍后会联系您处理结果',
  paramsError: '参数错误！',
  error: '订单申诉失败！',
  warning: '异常,未知错误！',
  notice: '是否确认订单申诉？',
  cancel: '您已取消订单申诉！'
};

/**
 * 提交订单申诉
 * @param {params} params 参数
 */

export default async function(params, loading = 2) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        accessToken: params.accessToken,
        appId: params.appId,
        orderId: params.orderId,
        remark: params.remark,
        pics: params.pics
      },
      {
        method: 'POST' // 请求方法， GET 、POST ...
      },
      loading,
      msg['request']
    );

    promise.then(response => {
      if (response['code'] === code['success']) {
        Message.success(msg['success']);
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
