import axios from './axios';
import configs from '../config';
/**
 * 获取银行卡类型
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/co/cardDetail.do';

const code = {
  success: '000',
  error: '',
  warning: ''
};

// const msg = {
//   success: '获取银行卡类型成功！',
//   paramsError: '参数错误！',
//   error: '获取银行卡类型失败，请仔细核对卡号！',
//   warning: '异常,未知错误！'
// }

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 1) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        cardNo: params.cardNo
      },
      {},
      loading
    );

    promise.then(response => {
      if (response.code === code['success']) {
        resolve(response['data'] || {});
      } else {
        // Toast(msg['error'])
        reject(response);
      }
    });
    promise.catch(error => {
      reject(error);
    });
  });
}
