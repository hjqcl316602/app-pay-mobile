/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-20 09:44:24
 * @LastEditors: Please set LastEditors
 */

const isTest = (function() {
  let href = window.location.href;
  if (href.indexOf('192.168.0') > -1 || href.indexOf('localhost') > -1) {
    return true;
  }
  return false;
})();

//console.log(isTest);

const payBefore = r => require.ensure([], () => r(require('@/view/payBefore.vue')), 'payBefore');
const pay = r => require.ensure([], () => r(require('@/view/pay.vue')), 'pay');
const payStatus = r => require.ensure([], () => r(require('@/view/payStatus.vue')), 'payStatus');
const draw = r => require.ensure([], () => r(require('@/view/draw.vue')), 'draw');
const drawStatus = r => require.ensure([], () => r(require('@/view/drawStatus.vue')), 'drawStatus');

const error = r => require.ensure([], () => r(require('@/view/error.vue')), 'error');
const custom = r => require.ensure([], () => r(require('@/view/custom.vue')), 'custom');
const customSubmit = r => require.ensure([], () => r(require('@/view/customSubmit.vue')), 'customSubmit');
const customDetail = r => require.ensure([], () => r(require('@/view/customDetail.vue')), 'customDetail');

const alipay = r => require.ensure([], () => r(require('@/view/alipay.vue')), 'alipay');

let routes = [
  { path: '*', redirect: '/error' },
  { path: '/', redirect: '/error' },
  { path: '/error', name: 'Error', component: error, meta: { keepAlive: false, title: '反馈', isLogin: false } },
  { path: '/payBefore', name: 'payBefore', component: payBefore, meta: { keepAlive: false, title: '信息填写', isLogin: false, isTest: isTest } },
  { path: '/pay/:accessToken/:token/:payType/:appId', name: 'Pay', component: pay, meta: { keepAlive: false, title: '支付', isLogin: false } },
  { path: '/payStatus/:accessToken/:appId', name: 'PayStatus', component: payStatus, meta: { keepAlive: false, title: '支付状态', isLogin: false } },
  { path: '/draw/:accessToken/:token/:appId', name: 'Draw', component: draw, meta: { keepAlive: false, title: '提现', isLogin: false } },
  { path: '/drawStatus/:accessToken/:appId', name: 'DrawStatus', component: drawStatus, meta: { keepAlive: false, title: '提现状态', isLogin: false } },
  { path: '/custom/:appId/:accessToken', name: 'Custom', component: custom, meta: { keepAlive: false, title: '订单申诉', isLogin: false } },
  { path: '/custom/submit/:appId/:accessToken', name: 'CustomSubmit', component: customSubmit, meta: { keepAlive: false, title: '提交申诉', isLogin: false } },
  { path: '/custom/detail/:appId/:accessToken', name: 'CustomDetail', component: customDetail, meta: { keepAlive: false, title: '申诉详情', isLogin: false } },
  { path: '/alipay/:token/:payType', name: 'alipay', component: alipay, meta: { keepAlive: false, title: '支付宝', isLogin: false } }
];

routes = routes.filter(route => {
  let meta = route['meta'];
  let need = !!meta && 'isTest' in meta;
  return need ? meta['isTest'] : true;
});

console.log(routes);

export default routes;
