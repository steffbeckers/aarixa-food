// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Steff
import moment from 'moment'
import VueCookie from 'vue-cookie'

// Vuetify
Vue.use(Vuetify)
Vue.config.productionTip = false

// Steff
Vue.use(VueCookie)

// Steff - Global filters
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
  router,
  components: { App },
  template: '<App/>'
})
