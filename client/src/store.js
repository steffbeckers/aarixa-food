import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    splitter: {
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        toggle (state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen
          } else {
            state.open = !state.open
          }
        }
      }
    },
    auth: {
      namespaced: true,
      state: {
        authenticated: false
      },
      mutations: {
        set (state) {
          if (typeof state === 'boolean') {
            state.authenticated = state
          }
        }
      }
    }
  }
})
