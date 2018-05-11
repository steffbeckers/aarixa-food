<template>
  <v-ons-page id="app">
    <v-ons-splitter :v-if="authenticated">
      <v-ons-splitter-side swipeable collapse width="250px"
        :animation="$ons.platform.isAndroid() ? 'overlay' : 'reveal'"
        :open.sync="menuIsOpen">
        <menu-page></menu-page>
      </v-ons-splitter-side>

      <v-ons-splitter-content>
        <home-page></home-page>
      </v-ons-splitter-content>
    </v-ons-splitter>
  </v-ons-page>
</template>

<script>
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import LoginPage from './pages/LoginPage'

export default {
  name: 'app',
  computed: {
    menuIsOpen: {
      get () {
        return this.$store.state.splitter.open
      },
      set (newValue) {
        this.$store.commit('splitter/toggle', newValue)
      }
    },
    authenticated: {
      get () {
        return this.$store.state.auth.authenticated
      },
      set (newValue) {
        this.$store.commit('auth/set', newValue)
      }
    }
  },
  components: {
    HomePage,
    MenuPage,
    LoginPage
  }
}
</script>

<style>
body {
  font-family: "Calibri Light", sans-serif;
}

ons-splitter-side[side=left][animation=overlay] {
  border-right: 1px solid #BBB;
}

ons-page > div.page__background {
  background-color: #f6f6f6;
}

ons-toolbar.home-toolbar {
  background-color: #ffffff;
}

ons-toolbar.login-toolbar {
  background-color: #ffffff;
}
</style>
