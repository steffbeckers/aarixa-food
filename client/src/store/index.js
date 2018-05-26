import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'

Vue.use(Vuex)
Vue.use(VueCookie)

export default new Vuex.Store({
  state: {
    authenticated: Vue.cookie.get('$aariXaFood$token') !== null,
    token: Vue.cookie.get('$aariXaFood$token'),
    user: JSON.parse(Vue.cookie.get('$aariXaFood$user')),
    isAdmin:
      JSON.parse(Vue.cookie.get('$aariXaFood$user')) &&
      JSON.parse(Vue.cookie.get('$aariXaFood$user')).roles
        ? JSON.parse(Vue.cookie.get('$aariXaFood$user')).roles.includes(
          'Administrator'
        )
        : false
  },
  mutations: {
    authenticate(state, credentials) {
      // Set state
      state.authenticated = true
      state.token = credentials.id
      state.user = credentials.user
      state.isAdmin = credentials.user.roles.includes('Administrator')
      // Save cookies
      Vue.cookie.set('$aariXaFood$token', credentials.id, {
        expires: credentials.ttl + 's'
      })
      Vue.cookie.set('$aariXaFood$user', JSON.stringify(credentials.user), {
        expires: credentials.ttl + 's'
      })
      // Set Authorization token on request
      Vue.prototype.$axios.defaults.headers.common['Authorization'] =
        state.token
    },
    signOut(state) {
      // Set state
      state.authenticated = false
      state.token = null
      state.user = null
      // Remove cookies
      Vue.cookie.delete('$aariXaFood$token')
      Vue.cookie.delete('$aariXaFood$user')
      // Remove Authorization token on header
      delete Vue.prototype.$axios.defaults.headers.common['Authorization']
    }
  }
})
