import axios from './axios';
import configs from '../config';
import { Message } from 'store-vue-ui';

/**
 * 获取聊天列表
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST_BASIC'] + '/chat/getHistoryMessageKh.do';

const code = {
  success: '000',
  error: '',
  warning: ''
};

const msg = {
  success: '获取聊天列表成功！',
  paramsError: '参数错误！',
  error: '获取聊天列表失败！',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 1) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        orderId: params.orderId,
        minChatId: params.minChatId,
        appId: params.appId,
        accessToken: params.accessToken
      },
      {},
      loading
    );

    promise.then(response => {
      if (response.code === code['success']) {
        resolve(response['data']);
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
