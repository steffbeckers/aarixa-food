// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Steff
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import store from './store'
import moment from 'moment'
import VueCookie from 'vue-cookie'

Vue.use(VueCookie)
Vue.prototype.$axios = axios

// Set Authorization header, if token exists
var token = Vue.cookie.get('$aariXaFood$token')
if (token) {
  Vue.prototype.$axios.defaults.headers.common['Authorization'] = token
}

// Global filters
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
Vue.filter('formatDateTime', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm')
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
Vue.filter('formatMoney', function (value) {
  if (value && typeof value === 'number') {
    if (value === 0) { return '' }
    return '€ ' + value.toFixed(2)
  }
  return ''
})

// Vuetify
Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
