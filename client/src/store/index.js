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
    isAdmin:
      JSON.parse(Vue.cookie.get('$aariXaFood$user')) &&
      JSON.parse(Vue.cookie.get('$aariXaFood$user')).roles
        ? JSON.parse(Vue.cookie.get('$aariXaFood$user')).roles.includes(
          'Administrator'
        )
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
    },
    setUserFavoriteMenuItems(state, favorites) {
      state.user.favoriteMenuItems = favorites
    },
    setUserFavoriteMenuItemsBySupplier(state, supplierIdAndFavorites) {
      if (state.user.favoriteMenuItems === undefined) {
        state.user.favoriteMenuItems = {}
      }
      state.user.favoriteMenuItems[supplierIdAndFavorites.supplierId] = supplierIdAndFavorites.favorites

      // Clean up userModel object
      if (supplierIdAndFavorites.favorites.length === 0) {
        delete state.user.favoriteMenuItems[supplierIdAndFavorites.supplierId]
      }

      // Save cookie
      Vue.cookie.set('$aariXaFood$user', JSON.stringify(state.user))
    }
  }
})
