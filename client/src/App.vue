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
      <v-layout
        column
        align-center
      >
        <img class="mt-3 mb-3" src="@/assets/aariXa_Logo.png" alt="aariXa" />
        <p>Bestel eten bij aariXa!</p>
      </v-layout>
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
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
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn :to="{ name: 'Leverancier', params: { slug: 'chanry' }}" flat>Chanry</v-btn>
        <v-btn :to="{ name: 'Leverancier', params: { slug: 'orient' }}" flat>Orient</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content class="mt-2">
      <router-view/>
    </v-content>
    <v-footer 
      :fixed="fixed" 
      app
    >
      <v-layout
        column
        align-right
      >
        <div>&copy; <a href="http://steffbeckers.eu/">Steff</a></div>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<style scoped>
  aside.navigation-drawer img {
    max-width: 200px;
  }
</style>

<script>
  export default {
    data () {
      return {
        clipped: false,
        drawer: false,
        miniVariant: false,
        fixed: true,
        items: [
          {
            icon: 'dashboard',
            title: 'Bestellingen',
            page: '/'
          },
          {
            icon: 'list',
            title: 'Leveranciers',
            page: '/leveranciers'
          }
        ],
        title: 'aariXaFood'
      }
    },
    mounted: function () {
      this.loginWithCredentialsFromEmail()
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
            this.$cookie.set('$aariXaFood$userId', credentialsObject.userId, {expires: credentialsObject.ttl + 's'})
            this.$cookie.set('$aariXaFood$username', credentialsObject.user.username, {expires: credentialsObject.ttl + 's'})
            // Remove query param
            this.$router.replace('/')
          }
        }
      }
    },
    name: 'App'
  }
</script>
