/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-17 16:21:26
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue';
import 'vant/lib/index.css';
import './ui.less';
import { Image, Ratio, Message } from 'store-vue-ui';
import { Toast, Dialog, Field, Popup, Tab, Tabs, Checkbox, Loading } from 'vant';
Vue.use(Toast)
  .use(Dialog)
  .use(Field)
  .use(Popup)
  .use(Tab)
  .use(Tabs)
  .use(Checkbox)
  .use(Loading);

Vue.use(Image)
  .use(Ratio)
  .use(Message);
