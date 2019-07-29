import Vue from 'vue';
import { css, flex, flexItem } from 'store-vue-directive';
let color = [{ label: 'primary', value: '#118eea' }, { label: 'warning', value: '#f1e600' }, { label: 'danger', value: 'red' }];
let backgroundColor = [];
Vue.use(css, { configs: { color, backgroundColor } })
  .use(flex)
  .use(flexItem);
