const pay = r => require.ensure([], () => r(require('@/view/pay.vue')), 'pay');
const payStatus = r => require.ensure([], () => r(require('@/view/payStatus.vue')), 'payStatus');
const draw = r => require.ensure([], () => r(require('@/view/draw.vue')), 'draw');
const drawStatus = r => require.ensure([], () => r(require('@/view/drawStatus.vue')), 'drawStatus');

const error = r => require.ensure([], () => r(require('@/view/error.vue')), 'error');
const custom = r => require.ensure([], () => r(require('@/view/custom.vue')), 'custom');
const customSubmit = r => require.ensure([], () => r(require('@/view/customSubmit.vue')), 'customSubmit');
const customDetail = r => require.ensure([], () => r(require('@/view/customDetail.vue')), 'customDetail');

const alipay = r => require.ensure([], () => r(require('@/view/alipay.vue')), 'alipay');

export default [
  { path: '*', redirect: '/error' },
  { path: '/', redirect: '/error' },
  { path: '/error', name: 'Error', component: error, meta: { keepAlive: false, title: '反馈', isLogin: false } },
  { path: '/pay/:accessToken/:token/:payType', name: 'Pay', component: pay, meta: { keepAlive: false, title: '支付', isLogin: false } },
  { path: '/payStatus/:accessToken', name: 'PayStatus', component: payStatus, meta: { keepAlive: false, title: '支付状态', isLogin: false } },
  { path: '/draw/:accessToken/:token', name: 'Draw', component: draw, meta: { keepAlive: false, title: '提现', isLogin: false } },
  { path: '/drawStatus/:accessToken', name: 'DrawStatus', component: drawStatus, meta: { keepAlive: false, title: '提现状态', isLogin: false } },
  { path: '/custom/:appId/:accessToken', name: 'Custom', component: custom, meta: { keepAlive: false, title: '订单申诉', isLogin: false } },
  { path: '/custom/submit/:appId/:accessToken', name: 'CustomSubmit', component: customSubmit, meta: { keepAlive: false, title: '提交申诉', isLogin: false } },
  { path: '/custom/detail/:appId/:accessToken', name: 'CustomDetail', component: customDetail, meta: { keepAlive: false, title: '申诉详情', isLogin: false } },
  { path: '/alipay', name: 'alipay', component: alipay, meta: { keepAlive: false, title: '支付宝', isLogin: false } }
];
