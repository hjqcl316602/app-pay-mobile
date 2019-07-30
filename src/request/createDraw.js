import axios from './axios';
import configs from '../config';
import { Message } from 'store-vue-ui';

/**
 * 提现
 * @param {params} params 参数
 */

const url = configs['HTTP_REQUEST'] + '/pay/withdraw.do';

const code = {
  success: '000',
  error: '',
  warning: ''
};

const msg = {
  requst: '提现申请中...',
  success: '提现申请已成功提交，注意查账！',
  paramsError: '参数错误！',
  error: '提现申请失败，请稍后重试！',
  warning: '异常,未知错误！'
};

// params [appId,accessToken,pageNum,pageSize]

export default function(params, loading = 2) {
  return new Promise((resolve, reject) => {
    let promise = axios(
      url,
      {
        accessToken: params.accessToken,
        //randCode:params.randCode,
        channelId: params.channelId,
        bank: params.bank,
        bankRealName: params.bankRealName,
        cardNo: params.cardNo,
        wechat: params.wechat,
        wechatUrl: params.wechatUrl,
        qrWeCodeUrl: params.qrWeCodeUrl,
        alipay: params.alipay,
        alipayUrl: params.alipayUrl,
        alipayCodeUrl: params.alipayCodeUrl,
        alipayRealName: params.alipayRealName,
        unionpay: params.unionpay,
        unionpayUrl: params.unionpayUrl,
        unionpayCodeUrl: params.unionpayCodeUrl
      },
      {},
      loading,
      msg['requst']
    );

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
