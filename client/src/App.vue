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
  mounted: function () {
    this.loginWithCredentialsFromEmail()
  },
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
  methods: {
    loginWithCredentialsFromEmail () {
      // Retrieve credentials from route
      var credentials = this.$route.query.credentials
      if (credentials) {
        // Decode credentials
        var credentialsDecoded = atob(credentials)
        // Check if decoded credentials is an object (login response)
        if (credentialsDecoded.charAt(0) === '{' &&
          credentialsDecoded.charAt(credentialsDecoded.length - 1) === '}') {
          var credentialsObject = JSON.parse(credentialsDecoded)
          // Save credentials to cookies
          this.$cookie.set('$aariXaFood$token', credentialsObject.id, {expires: credentialsObject.ttl + 's'})
          this.$cookie.set('$aariXaFood$user', JSON.stringify(credentialsObject.user), {expires: credentialsObject.ttl + 's'})
          this.$cookie.set('$aariXaFood$username', credentialsObject.user.username, {expires: credentialsObject.ttl + 's'})
          // Remove query param
          this.$router.replace('/')
        }
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
