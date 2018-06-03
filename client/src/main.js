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

// Global request interceptor
Vue.prototype.$axios.interceptors.request.use(
  function(config) {
    // Loader
    store.commit('loader', true)

    return config
  },
  function(error) {
    // Loader
    store.commit('loader', false)

    return Promise.reject(error)
  }
)

// Global response interceptor
var statusCode0Count = 0
Vue.prototype.$axios.interceptors.response.use(
  function(response) {
    // Loader
    store.commit('loader', false)

    // Logging
    if (process.env.NODE_ENV === 'development') {
      console.log(response.request.responseURL)
      console.log(response.status, JSON.parse(JSON.stringify(response.data)))
    }

    return response
  },
  function(error) {
    // Loader
    store.commit('loader', false)

    // If request status is 0 (no connection to API)
    if (error.request.status === 0 && statusCode0Count === 0) {
      statusCode0Count++
      // Custom response
      error.response = {data: {error: {message: 'Kan niet connecteren naar API.'}}}
      return Promise.reject(error.response.data.error)
    } else if (error.request.status === 0) {
      return Promise.resolve(error)
    }

    // Logging
    if (error.request) console.log(error.request.responseURL)
    if (error.response) console.log(error.response.status, JSON.parse(JSON.stringify(error.response.data)))

    // Log out on unauthorized
    if (error.response && error.response.status === 401) {
      store.commit('signOut')
      store.commit('drawer', true)
    }

    return Promise.reject(error.response.data.error)
  }
)

// Route guards
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!store.state.isAdmin) {
      next({
        name: 'Root',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.authenticated) {
      next({
        name: 'Root',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

// Global filters
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})
Vue.filter('formatTime', function(value) {
  if (value) {
    return moment(String(value)).format('HH:mm')
  }
})
Vue.filter('formatDateTime', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm')
  }
})
Vue.filter('formatWebsite', function(value) {
  if (value) {
    var websiteUrl = String(value)
      .toLocaleLowerCase()
      .replace('https', '')
      .replace('http', '')
      .replace('://', '')
    if (websiteUrl.endsWith('/')) {
      websiteUrl = websiteUrl.slice(0, -1)
    }
    return websiteUrl
  }
})
Vue.filter('formatMoney', function(value) {
  if (value && typeof value === 'number') {
    if (value === 0) {
      return ''
    }
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
