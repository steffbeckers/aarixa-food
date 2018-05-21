import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'

Vue.use(Vuex)
Vue.use(VueCookie)

export default new Vuex.Store({
  state: {
    authenticated: VueCookie.get('$aariXaFood$token') !== null,
    token: VueCookie.get('$aariXaFood$token'),
    user: JSON.parse(VueCookie.get('$aariXaFood$user'))
  },
  mutations: {
    authenticate (state, credentials) {
      // Set state
      state.authenticated = true
      state.token = credentials.id
      state.user = credentials.user
      // Save cookies
      VueCookie.set('$aariXaFood$token', credentials.id, {expires: credentials.ttl + 's'})
      VueCookie.set('$aariXaFood$user', JSON.stringify(credentials.user), {expires: credentials.ttl + 's'})
    },
    signOut (state) {
      // Set state
      state.authenticated = false
      state.token = null
      state.user = null
      // Remove cookies
      VueCookie.remove('$aariXaFood$token')
      VueCookie.remove('$aariXaFood$user')
    }
  }
})
