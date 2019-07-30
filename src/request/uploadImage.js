import axios from 'axios';
import { Toast } from 'vant';
import { Message } from 'store-vue-ui';
/**
 * 上传图片
 * @param {params} params 参数
 */

// const url = configs['HTTP_REQUEST_BASIC'] + '/uc/upload/oss/image';
//const url = configs['HTTP_REQUEST_UPLOAD'] + '/res/upload/image/compress.do';

const getUrl = function() {
  let origin = window.location.origin;
  let index = ['localhost', '192.168', 'trade.bstchain'].findIndex(item => {
    return origin.includes(item);
  });
  return (index === -1 ? origin : 'http://103.91.217.67') + '/res/upload/image/compress.do';
};

const url = getUrl();

//console.log(url);

const code = {
  success: '000',
  error: '',
  warning: ''
};

const msg = {
  request: '图片上传中...',
  success: '图片上传成功！',
  paramsError: '参数错误！',
  error: '图片上传失败，请重试！',
  warning: '异常,未知错误！'
};

export default function(params, loading = true, loadingMsg = msg['request']) {
  let toast;
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
      console.log(response);

      if (response['code'] === code['success']) {
        clearToast().then(() => {
          resolve(response['data']);
        });
      } else {
        Message.warning(msg['error']); // 会自动挤掉loading
        reject(response);
      }
    });

    promise.catch(error => {
      Message.danger(msg['warning']);
      reject(error);
    });
  });
}
