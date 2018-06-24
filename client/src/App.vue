<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="$store.state.drawer"
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
            <v-alert :value="emailSent" type="success">
              E-mail verzonden naar {{ email }}. Klik op de link in de e-mail om in te loggen.
            </v-alert>
            <v-alert :value="emailError" type="error">
              Er ging even iets mis, probeer het later opnieuw. Of stuur een <a style="color: #fff;" href="mailto:steff@steffbeckers.eu?subject=aariXaFood - Error bij aanmelden&body=Dag Steff, Ik kan me niet aanmelden op aariXaFood. ...">e-mail naar Steff</a>.
            </v-alert>
            <v-form
              ref="loginForm"
              v-model="loginFormValid"
              @submit="sendLoginCredentialsEmail"
            >
              <span v-if="nodeEnv === 'development'" @click="email = 'steff.beckers@aariXa.be'">steff.beckers@</span>
              <span v-if="nodeEnv === 'development'" @click="email = 'steff@aariXa.be'">steff@</span>
              <v-text-field
                id="email"
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
                :loading="this.$store.state.loading"
                clearable
              >
              </v-text-field>
              <v-btn
                block
                color="primary"
                :disabled="!loginFormValid"
                type="submit"
                class="elevation-0"
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
              <v-list-tile-sub-title v-if="this.$store.state.isAdmin">Administrator</v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="this.$store.state.isOfficeManager">Office Manager</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action @click="signOut">
              <v-icon>fa-sign-out</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile
          v-for="(item, i) in sideMenuItems"
          :key="i"
          :to="item.page"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile>
      </v-list>
      <v-list v-if="$store.state.isAdmin">
        <v-list-group
          prepend-icon="account_circle"
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>Administratie</v-list-tile-title>
          </v-list-tile>
          <v-list-tile :to="{ name: 'AdminUserModels' }">
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>aariXianen</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      app
      color="primary white--text"
    >
      <v-toolbar-side-icon class="white--text mr-1" @click.stop="$store.commit('drawer', !$store.state.drawer)"></v-toolbar-side-icon>
      <v-progress-circular v-if="$store.state.loading" :size="50" :indeterminate="true" color="white">
        <img class="mt-2" src="@/assets/aariXa_Shield_32x32.png" alt="aariXa Schild" width="32" height="32" />
      </v-progress-circular>
      <div v-if="!$store.state.loading" style="position: relative; width: 50px; height: 50px;">
        <div style="position: absolute; width: 32px; height: 32px; left: 9px; top: 10px;">
          <img src="@/assets/aariXa_Shield_32x32.png" alt="aariXa Schild" width="32" height="32" />
        </div>
      </div>
      <v-toolbar-title class="ml-1 white--text" v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn class="white--text" :to="{ name: 'SupplierDetail', params: { slug: 'chanry' }}" flat>Chanry</v-btn>
        <v-btn class="white--text" :to="{ name: 'SupplierDetail', params: { slug: 'orient' }}" flat>Orient</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-bottom-nav
      :fixed="fixed"
      :value="showBottomNav"
      class="elevation-0"
      style="background-color: rgba(255, 255, 255, 0.75)"
    >
      <v-btn :to="{ name: 'Root' }" exact flat color="primary">
        <span>Bestellingen</span>
        <v-icon>dashboard</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'Suppliers' }" flat color="primary">
        <span>Leveranciers</span>
        <v-icon>fastfood</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'Fridge' }" flat color="primary">
        <span>Koelkast</span>
        <v-icon>kitchen</v-icon>
      </v-btn>
    </v-bottom-nav>
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

main.content {
  margin-bottom: 60px;
}

div.bottom-nav--fixed {
  margin-bottom: 36px;
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
export default {
  data() {
    return {
      loginFormValid: false,
      email: '@aariXa.be',
      emailDefault: '@aariXa.be',
      emailRules: [
        v => !!v || 'E-mail is vereist',
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail moet correct zijn'
      ],
      emailSent: false,
      emailError: false,
      sideMenuItems: [
        {
          icon: 'dashboard',
          title: 'Bestellingen',
          page: {
            name: 'Root'
          }
        },
        {
          icon: 'fastfood',
          title: 'Leveranciers',
          page: {
            name: 'Suppliers'
          }
        },
        {
          icon: 'restaurant',
          title: 'Keuken',
          page: {
            name: 'Kitchen'
          }
        },
        {
          icon: 'kitchen',
          title: 'Koelkast',
          page: {
            name: 'Fridge'
          }
        }
      ],
      buildDateTime: process.env.BUILD_DATETIME,
      nodeEnv: process.env.NODE_ENV,
      clipped: false,
      showBottomNav: true,
      miniVariant: false,
      fixed: true,
      title: 'aariXaFood'
    }
  },
  mounted: function() {
    this.loginWithCredentialsFromEmail()
    // Close drawer if already authenticated, open if not
    this.$store.commit('drawer', !this.$store.state.authenticated)
  },
  methods: {
    sendLoginCredentialsEmail(e) {
      e.preventDefault() // Submit

      // Reset messages
      this.emailSent = false
      this.emailError = false

      // Validation
      if (!this.$refs.loginForm.validate()) { return }

      this.$axios
        .post(process.env.API + '/UserModels/login', { email: this.email })
        .then(response => {
          // Show message
          if (response.data.code === 'AUTH_EMAIL_SENT') {
            this.emailSent = true
          }

          // Login automatically in development
          if (process.env.NODE_ENV === 'development') {
            this.$router.push({
              path: '/',
              query: {
                credentials: response.data.credentials,
                redirect: this.$route.fullPath
              }
            })
          }
        })
        .catch(() => {
          this.emailError = true
        })
    },
    loginWithCredentialsFromEmail() {
      // Retrieve credentials from route
      let credentials = this.$route.query.credentials
      if (credentials) {
        // Decode credentials
        let credentialsDecoded = atob(credentials)
        // Check if decoded credentials is an object (login response)
        if (
          credentialsDecoded.charAt(0) === '{' &&
          credentialsDecoded.charAt(credentialsDecoded.length - 1) === '}'
        ) {
          let credentialsObject = JSON.parse(credentialsDecoded)
          // Authenticate
          this.$store.commit('authenticate', credentialsObject)
          // Redirect
          this.$router.push({ path: this.$route.query.redirect })
        }
      }
    },
    signOut() {
      this.$axios
        .post(process.env.API + '/UserModels/logout')
        .then(response => {
          this.$store.commit('signOut')
          // Reset login email
          this.email = this.emailDefault
        })
    }
  },
  computed: {
    firstLetterOfUser() {
      if (this.$store.state.authenticated && this.$store.state.user.username) {
        return this.$store.state.user.username.substr(0, 1)
      }
      return ''
    }
  },
  watch: {
    $route(to, from) {
      // Check which bottom nav to highlight
      this.showBottomNavActive = this.$route.name === 'Root' ? 0 : 1
      // Try to login on change
      this.loginWithCredentialsFromEmail()
    }
  },
  name: 'App'
}
</script>
