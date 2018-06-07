import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'

Vue.use(Vuex)
Vue.use(VueCookie)

export default new Vuex.Store({
  state: {
    loading: false,
    loadingCounter: 0,
    drawer: false,
    authenticated: Vue.cookie.get('$aariXaFood$token') !== null,
    token: Vue.cookie.get('$aariXaFood$token'),
    user: JSON.parse(Vue.cookie.get('$aariXaFood$user')),
    favoriteMenuItems: JSON.parse(localStorage.getItem('$aariXaFood$favoriteMenuItems')),
    isAdmin:
      JSON.parse(Vue.cookie.get('$aariXaFood$user')) &&
      JSON.parse(Vue.cookie.get('$aariXaFood$user')).roles
        ? JSON.parse(Vue.cookie.get('$aariXaFood$user')).roles.includes('Administrator')
        : false
  },
  mutations: {
    loader(state, bool) {
      if (bool) {
        state.loadingCounter++
      } else {
        state.loadingCounter--
      }
      state.loadingCounter > 0 ? state.loading = true : state.loading = false
    },
    drawer(state, bool) {
      state.drawer = bool
    },
    authenticate(state, credentials) {
      // Set favoriteMenuItems
      state.favoriteMenuItems = credentials.user.favoriteMenuItems
      localStorage.setItem('$aariXaFood$favoriteMenuItems', JSON.stringify(state.favoriteMenuItems))
      delete credentials.user.favoriteMenuItems
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
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = state.token
    },
    signOut(state) {
      // Set state
      state.authenticated = false
      state.token = null
      state.user = null
      // Remove cookies
      Vue.cookie.delete('$aariXaFood$token')
      Vue.cookie.delete('$aariXaFood$user')
      // Remove local storage
      localStorage.clear()
      // Remove Authorization token on header
      delete Vue.prototype.$axios.defaults.headers.common['Authorization']
    },
    setUserFavoriteMenuItemsBySupplier(state, supplierIdAndFavorites) {
      // Update state
      if (state.favoriteMenuItems === null || state.favoriteMenuItems === undefined) {
        state.favoriteMenuItems = {}
      }
      state.favoriteMenuItems[supplierIdAndFavorites.supplierId] = supplierIdAndFavorites.favorites

      // Clean up favorites object
      if (supplierIdAndFavorites.favorites.length === 0) {
        delete state.favoriteMenuItems[supplierIdAndFavorites.supplierId]
      }

      // Update local storage
      localStorage.setItem('$aariXaFood$favoriteMenuItems', JSON.stringify(state.favoriteMenuItems))
    }
  }
})
