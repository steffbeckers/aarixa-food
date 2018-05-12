// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'font-awesome/css/font-awesome.css'
import 'onsenui/css/onsenui-core.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueResource from 'vue-resource'

import $ons from 'vue-onsenui/esm'
import * as VOns from './vue-onsen-components'

import store from './store'
import router from './router'
import App from './App'

Vue.config.productionTip = false

Vue.use($ons)
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))

Vue.use(VueCookie)

Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
