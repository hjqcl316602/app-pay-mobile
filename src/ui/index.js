import Vue from 'vue';
import 'vant/lib/index.css';
import './ui.less';
import { Image, Ratio, Message } from 'store-vue-ui';
import { Toast, Dialog, Field, Popup, Tab, Tabs, Checkbox } from 'vant';
Vue.use(Toast)
  .use(Dialog)
  .use(Field)
  .use(Popup)
  .use(Tab)
  .use(Tabs)
  .use(Checkbox);

Vue.use(Image)
  .use(Ratio)
  .use(Message);


