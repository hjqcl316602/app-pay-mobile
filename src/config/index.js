/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:12
 * @LastEditTime: 2019-08-17 09:30:29
 * @LastEditors: Please set LastEditors
 */
const configs = {};

configs['TYPE'] = 1;

configs['LOCAL'] = false;

//浏览器的类型（支付宝 or 微信）
configs['TYPE_BROWSER'] = (function() {
  let userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.match(/Alipay/i) == 'alipay') {
    return 'ali';
  } else if (userAgent.match(/MicroMessenger/i) == 'micromessenger') {
    return 'wx';
  }
  return 'no';
})();

configs['TYPE_HTTP'] = (function() {
  if (window.location.href.indexOf('dev.bstchain.com') > -1) {
    /* http://dev.bstchain.com/sc/index.html#/Main/User*/
    return 'dev'; // 测试环境
  }
  if (window.location.href.indexOf('m.bstchain.com') > -1) {
    return 'production'; // 生产环境
  }
  if (window.location.href.indexOf('192.168') > -1 || window.location.href.indexOf('localhost') > -1) {
    return 'localhost'; //开发环境
  }
})();

configs['HTTP_REQUEST'] = (function() {
  if (configs['TYPE_HTTP'] === 'localhost') {
    return configs['LOCAL'] ? 'http://192.168.0.109:18091/st' : 'http://trade.bstchain.com/p'; // http://192.168.0.108:18091 、 http://dev.bstchain.com
  } else {
    return '/p';
  }
})();

configs['HTTP_REQUEST_BASIC'] = (function() {
  if (configs['TYPE_HTTP'] === 'localhost') {
    return configs['LOCAL'] ? 'http://192.168.0.109:18091/st' : 'http://trade.bstchain.com'; // http://192.168.0.108:18091 、 http://dev.bstchain.com
  } else {
    return '..';
  }
})();

configs['HTTP'] = window.location.origin;

configs[
  'KEY_PRIVATE'
] = `MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJ7sumXyGv3sNUvOtHrrW4tPjdBvRDHN+PSl7qH17iTZu7IgwnfvVwGawGsZsCwggk0T+ZefrAw4nUsoLGs0MoCeIgCA/BjYYFZzyPJXLCKP90FBglnTQRz1W6TXVJKCTm2hc5a495k3jLA78WgtWk6sdgAc3lqU4bPj/h30DO5tAgMBAAECgYBiRsPRrRCx+3LNySpkZMy8blqlDVlfbx7HsyDJePpmQVrHgWigoBnuvRLGaCFAeG37WiHbeHr9J7llM5ecR6/+SxnGTb3QB3fIlMKExDWPr13TfCWlT7rMheUYLMNWXQ9r0OsCBEpFegi9yifYy9Lj/9dtb8ZfL2O+nnMGt157QQJBAOnTpW3XRlgslC/UTkJifhwFNXU6xaKHyR77++g8Uc6XDiY1+BG0oh2/wN8BFHSU+N6FKWUsVBLdApZvUUjqFl0CQQCt/sSk0HT0MSfxc5rVzQ944cmi30+uuVaptc0kgzHpdFiwULwWcPwDZ/s9PlVNk75HgSMuTOgej6Yj1nZXR5dRAkBsRwG4F5QPiLUmYN3Mh+d1+kODAbA7Tz2nB3DjXetUC0cWEq/JIyhfNkiN++YJBmMoR+mfXCOiiI2GNA4kAaJRAkEAmHl1K5U9mCxne3C6U/fCQkVi5Kba9huWtVwK7J9HovSBL+lgGi5iuj1p7o5sRHJfQdwJz243z2hEyI0M4YlsMQJBAIneReh0GQzcSj3Yc3vbN3Hmfl7XfOmJ8s+vl9keheAUbcnfTo0yiRR+CcbTyH8pkhnq0Dfiise7uUHVgD/o53I=`;

configs['KEY_PUBLIC'] =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCe7Lpl8hr97DVLzrR661uLT43Qb0Qxzfj0pe6h9e4k2buyIMJ371cBmsBrGbAsIIJNE/mXn6wMOJ1LKCxrNDKAniIAgPwY2GBWc8jyVywij/dBQYJZ00Ec9Vuk11SSgk5toXOWuPeZN4ywO/FoLVpOrHYAHN5alOGz4/4d9AzubQIDAQAB';

configs['QR'] = {};
configs['QR']['WX'] = ['alipay']; // 反面判断不是微信
configs['QR']['ALI'] = ['wxp', 'weixin']; // 反面判断不是支付宝
configs['QR']['UNION'] = ['alipay', 'wxp', 'weixin']; // 反面判断不是支付宝

export default configs;
