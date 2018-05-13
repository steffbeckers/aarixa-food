<template>
  <v-ons-page>
    <v-ons-toolbar class="home-toolbar">
      <div class="left">
        <v-ons-toolbar-button @click="$store.commit('splitter/toggle')">
          <v-ons-icon icon="fa-bars"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
      <div class="center">aariXaFood</div>
      <div class="right" style="padding-right: 15px;" :v-if="$cookie.get('$aariXaFood$token')">
        {{ $cookie.get('$aariXaFood$username') }}
      </div>
    </v-ons-toolbar>

    <v-ons-pull-hook
      :action="loadOrders"
      @changestate="pullHookState = $event.state"
    >
      <span v-show="pullHookState === 'initial'"> Sleep om te vernieuwen </span>
      <span v-show="pullHookState === 'preaction'"> Loslaten </span>
      <span v-show="pullHookState === 'action'"> Laden ... </span>
    </v-ons-pull-hook>

    <v-ons-list-title>Bestellingen</v-ons-list-title>
    <v-ons-list v-if="orders && orders.length">
      <v-ons-list-item v-for="order in orders" :key="order">
        {{ order }}
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',
  data () {
    return {
      pullHookState: 'initial',
      orders: []
    }
  },
  mounted: function () {
    this.loadOrders(() => {})
  },
  methods: {
    loadOrders (done) {
      axios.get(process.env.API + '/orders')
        .then(response => {
          this.orders = response.data
          done()
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  text-align: center;
}

img {
  max-width: 300px;
}

ons-list-title {
  text-transform: none;
}

ons-list-title {
  margin-top: 10px;
}

ons-card {
  text-align: center;
}

ons-list-item, ons-card {
  cursor: pointer;
}
</style>
