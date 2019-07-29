import Vue from 'vue';
const filters = {
  strMoney(value, type = 'branch') {
    // type primary / branch
    let money = Number.isNaN(Number(value)); // 是否是金钱格式
    value = Number(value);
    if (money || value <= 0) {
      return '0.00';
    } else {
      return type === 'primary' ? value.toFixed(2) : (value / 100).toFixed(2);
    }
  },

  strCard(value) {
    if (!value && typeof value !== 'string') return;
    let strs = value.split('');
    let newStrs = [];
    for (let n = 0; n < strs.length; n++) {
      if (n > 0 && n % 4 === 0) {
        newStrs.push('  ');
      }
      newStrs.push(strs[n]);
    }
    return newStrs.join('');
  },

  strTime(value) {
    if (typeof value !== 'number') return 0;
    const MINUTE = 60 * 1000;
    let minutes = Math.floor(value / MINUTE);
    let seconds = Math.floor((value - minutes * MINUTE) / 1000);
    // console.log(minutes,seconds)
    return minutes === 0 && seconds === 0 ? '已过期' : minutes === 0 ? `${seconds}秒` : `${minutes}分 ${seconds}秒`;
  },

  strPayType(value) {
    return ['银行卡', '微信', '支付宝'][Number(value) - 1];
  },

  strPayStatus(value) {
    return ['已取消', '未付款', '已付款', '已完成'][Number(value)];
  },

  strAdvertiseType(value) {
    return ['提现', '充值'][value];
  },

  strOrderStatus(value) {
    return ['未申诉', '已申诉', '处理中', '已处理', '已关闭'][value];
  }
};

Object.keys(filters).forEach((key, i) => {
  Vue.filter(key, filters[key]);
});
