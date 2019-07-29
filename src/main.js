import Vue from 'vue';
import App from './app';
import router from './router';
import './directive';
import './filter';
import './mixins';
import './ui';
import './css';
import './assets/rem';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
