<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-container fluid>
        <v-layout row class="mb-3">
          <v-layout
            column
            align-center
          >
            <img class="mt-3 mb-3" src="@/assets/aariXa_Logo.png" alt="aariXa" />
            <p>Bestel eten bij aariXa!</p>
          </v-layout>
        </v-layout>
        <v-layout
          v-if="!this.$store.state.authenticated"
          row
          class="mb-3">
          <v-layout column>
            <h2>Aanmelden</h2>
          </v-layout>
        </v-layout>
        <v-layout
          v-if="!this.$store.state.authenticated"
          row
          class="mb-4"
        >
          <v-layout column>
            <v-form 
              ref="loginForm"
              v-model="loginFormValid"
              lazy-validation
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                :loading="loginFormLoading"
              >
              </v-text-field>
              <v-btn
                block
                color="primary"
                :disabled="!loginFormValid"
                @click="sendLoginCredentialsEmail"
              >
                Verstuur e-mail
              </v-btn>
            </v-form>
          </v-layout>
        </v-layout>
      </v-container>
      <v-toolbar v-if="this.$store.state.authenticated" flat class="transparent mb-2">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar v-if="!this.$store.state.user.avatar" color="primary">
              <span class="white--text headline">{{ firstLetterOfUser }}</span>
            </v-list-tile-avatar>
            <v-list-tile-avatar v-if="this.$store.state.user.avatar">
              <img :src="this.$store.state.user.avatar" :alt="this.$store.state.user.username">
            </v-list-tile-avatar>
            <v-list-tile-content v-if="this.$store.state.user.username">
              <v-list-tile-title>{{ this.$store.state.user.username }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action @click="signOut">
              <v-icon>fa-sign-out</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in sideMenuItems"
          :key="i"
          :to="item.page"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar 
      :clipped-left="clipped"
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img src="@/assets/aariXa_Shield_32x32.png" alt="aariXa Schild" />
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn :to="{ name: 'SupplierDetail', params: { slug: 'chanry' }}" flat>Chanry</v-btn>
        <v-btn :to="{ name: 'SupplierDetail', params: { slug: 'orient' }}" flat>Orient</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content class="mt-2">
      <router-view/>
    </v-content>
    <v-footer 
      :fixed="fixed" 
      app
    >
      <div id="buildInfo" class="ml-2">Laatste bijwerking: {{ buildDateTime }}</div>
      <div id="copyright" class="mr-2">&copy; <a href="http://steffbeckers.eu/">Steff</a></div>
    </v-footer>
  </v-app>
</template>

<style scoped>
  aside.navigation-drawer img {
    max-width: 200px;
  }

  #buildInfo {
    color: #ffffff;
    font-size: 11px;
    line-height: 11px;
  }

  #copyright {
    color: #868e96;
    margin-left: auto;    
  }

  #copyright a {
    text-decoration: none;
  }

  #copyright a:hover {
    text-decoration: underline;
  }
</style>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loginFormLoading: false,
      loginFormValid: false,
      email: '@aariXa.be',
      emailRules: [
        v => !!v || 'E-mail is vereist',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail moet correct zijn'
      ],
      sideMenuItems: [
        {
          icon: 'dashboard',
          title: 'Bestellingen',
          page: {
            name: 'Root'
          }
        },
        {
          icon: 'list',
          title: 'Leveranciers',
          page: {
            name: 'Suppliers'
          }
        }
      ],
      buildDateTime: process.env.BUILD_DATETIME,
      clipped: false,
      drawer: !this.$store.state.authenticated,
      miniVariant: false,
      fixed: true,
      title: 'aariXaFood'
    }
  },
  mounted: function () {
    this.loginWithCredentialsFromEmail()
  },
  methods: {
    sendLoginCredentialsEmail () {
      if (this.$refs.loginForm.validate()) {
        this.loginFormLoading = true
        axios.post(process.env.API + '/usermodels/login', {email: this.email})
          .then(response => {
            this.loginFormLoading = false

            if (process.env.NODE_ENV === 'development') {
              this.$router.push({path: '/', query: {credentials: response.data.credentials}})
              return
            }

            if (response.data.AUTH_EMAIL_SENT) {
              // Test
              console.log('E-mail sent')
            }
          })
          .catch(error => {
            this.loginFormLoading = false

            if (error.code === 'LOGIN_FAILED') {
              // Test
              console.log('Login failed')
            }
          })
      }
    },
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
          // Authenticate
          this.$store.commit('authenticate', credentialsObject)
          // Remove query param
          this.$router.push({path: '/'})
        }
      }
    },
    signOut () {
      this.$store.commit('signOut')
    }
  },
  computed: {
    firstLetterOfUser () {
      if (this.$store.state.user.username) {
        return this.$store.state.user.username.substr(0, 1)
      }
      return ''
    }
  },
  name: 'App'
}
</script>
