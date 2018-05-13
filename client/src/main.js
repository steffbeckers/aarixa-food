// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'font-awesome/css/font-awesome.min.css'
import 'onsenui/css/onsenui-core.css'
import 'onsenui/css/onsen-css-components.css'

import Vue from 'vue'
import VueCookie from 'vue-cookie'

import $ons from 'vue-onsenui/esm'
import * as VOns from './vue-onsen-components'

import store from './store'
import router from './router'
import App from './App'

import moment from 'moment'

Vue.config.productionTip = false

Vue.use($ons)
Object.values(VOns).forEach(comp => Vue.component(comp.name, comp))

Vue.use(VueCookie)

// Filters
Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})
Vue.filter('formatTime', function (value) {
  if (value) {
    return moment(String(value)).format('HH:mm')
  }
})
Vue.filter('formatWebsite', function (value) {
  if (value) {
    var websiteUrl = String(value).toLocaleLowerCase()
      .replace('https', '')
      .replace('http', '')
      .replace('://', '')
    if (websiteUrl.endsWith('/')) {
      websiteUrl = websiteUrl.slice(0, -1)
    }
    return websiteUrl
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
