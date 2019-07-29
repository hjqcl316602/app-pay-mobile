import Vue from 'vue';
const mixins = {
  methods: {
    // 重写van, toast 由于出现闪退
    $Toast(message, type = 'text') {
      // type  | success | fail | text | html
      setTimeout(() => {
        this.$toast({ message: message, duration: 3000, position: 'bottom', type: type });
      }, 100);
    }
  }
};
Vue.mixin(mixins);
