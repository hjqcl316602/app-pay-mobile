import axios from 'axios';
import { Toast } from 'vant';

/**
 * 上传并识别二维码
 * @param {params} params 参数
 */

// const url = configs['HTTP_REQUEST_BASIC'] + '/uc/upload/oss/qr';
//const url = configs['HTTP_REQUEST_UPLOAD'] + '/res/upload/image/qr.do'; // 专门的服务器做图片上传和识别
const getUrl = function() {
  let origin = window.location.origin;
  let index = ['localhost', '192.168', 'trade.bstchain'].findIndex(item => {
    return origin.includes(item);
  });
  return (index === -1 ? origin : 'http://103.91.217.67') + '/res/upload/image/qr.do';
};

const url = getUrl();

const code = {
  success: '000',
  error: '',
  warning: ''
};

const msg = {
  success: '二维码上传并识别成功！',
  paramsError: '参数错误！',
  error: '二维码上传或识别失败，请重试！',
  warning: '异常,未知错误！'
};

export default function(params, loading = true, loadingMsg = '图片上传并识别中...') {
  let toast = null;
  let interval = 0;
  if (loading) {
    toast = Toast.loading({
      mask: true,
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'circular',
      message: loadingMsg,
      position: 'center'
    });
    interval = 500;
  }

  let clearToast = function() {
    return new Promise(resolve => {
      setTimeout(() => {
        toast && toast.clear();
        resolve();
      }, interval);
    });
  };

  return new Promise((resolve, reject) => {
    let promise = axios.post(url, params);

    promise.then(data => {
      let response = data['data'];

      if (response['code'] === code['success']) {
        clearToast().then(() => {
          resolve(response['data'] || {});
        });
      } else {
        Toast(msg['error']);
        reject(response);
      }
    });

    promise.catch(error => {
      Toast(msg['warning']);
      reject(error);
    });
  });
}
