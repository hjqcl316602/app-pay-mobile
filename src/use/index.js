import Vue from 'vue'
// 导入vant ui 库  css 单独在index.html中引入
import { Toast, Dialog, Field, Popup, Tab, Tabs } from 'vant'
import { css, flex, flexItem } from 'store-vue-directive'
let color = [
  { label: 'primary', value: '#118eea' },
  { label: 'warning', value: '#f1e600' },
  { label: 'danger', value: 'red' }
]
let backgroundColor = [

]
Vue.use(css, { configs: { color, backgroundColor } }).use(flex).use(flexItem)

Toast.setDefaultOptions({
  position: 'bottom'
})
Dialog.setDefaultOptions({
  closeOnClickOverlay: true
})

Vue.use(Toast).use(Dialog).use(Field).use(Popup).use(Tab).use(Tabs)

// 在.babelrc文件中替换 - 不需要关心css文件，并且安装需要的组件即可
// "plugins": [
//   "transform-vue-jsx",
//   "transform-runtime",
//   [
//     "import",[ { "libraryName":"vant","libraryDirectory":"es","style":true }]
//   ]
// ]
