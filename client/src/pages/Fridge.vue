<template>
  <transition name="bounce">
    <v-container grid-list-lg fluid>
      <v-layout v-if="errors.length > 0" row>
        <v-flex>
          <v-alert :value="true" v-for="(error, index) in errors" :key="index" type="error">
            {{ error.message }}
          </v-alert>
        </v-flex>
      </v-layout>
      <v-layout v-if="!$store.state.authenticated" row wrap>
        <v-flex xs12>
          <v-alert :value="true" type="info">
            Meld je aan om drank uit de koelkast te kopen.
          </v-alert>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex>
          <div class="title">Koelkast</div>
          <p class="mt-2 mb-0">Alle items aan &euro; 0.50, tenzij anders vermeld.</p>
        </v-flex>
      </v-layout>
      <v-layout v-if="$store.state.authenticated && fridgeDataOfUser !== null" row wrap>
        <v-flex>
          <span>
            Mijn saldo: 
            <span v-if="fridgeDataOfUser.saldo > 0" style="color: green; font-weight: bold">{{ fridgeDataOfUser.saldo | formatMoney }}</span>
            <span v-else-if="fridgeDataOfUser.saldo < 0" style="color: red">{{ fridgeDataOfUser.saldo | formatMoney }}</span>
            <span v-else>&euro; 0.00</span>
          </span>
        </v-flex>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-flex
          lg2
          md3
          sm4
          xs6
          v-for="item in items" :key="item.id"
          class="mb-3"
        >
          <img @click="buy(item)" :src="'static/img/fridge/' + item.image" :alt="item.name" class="d-block mx-auto" :style="$store.state.authenticated ? 'height: 200px; cursor: pointer;' : 'height: 200px'">
          <div v-if="$store.state.authenticated && fridgeDataOfUser && fridgeDataOfUser.items && fridgeDataOfUser.items[item.slug]" class="d-block mx-auto mt-2 text-xs-center">
            <v-btn class="mt-0 mb-0" @click="remove(item)" icon ripple>
              <v-icon color="grey lighten-1">remove</v-icon>
            </v-btn>
            <div class="d-inline-block" style="font-size: 24px; font-weight: bold; position: relative; top: 4px">{{ fridgeDataOfUser.items[item.slug] }}</div>
            <v-btn class="mt-0 mb-0" @click="buy(item)" icon ripple>
              <v-icon color="grey lighten-1">add</v-icon>
            </v-btn>
          </div>
          <p v-if="$store.state.authenticated && fridgeDataOfUser && fridgeDataOfUser.items && fridgeDataOfUser.items[item.slug] > 1" class="mt-2 mb-0 text-xs-center">{{ item.namePlural }}</p>
          <p v-else class="mt-2 mb-0 text-xs-center">{{ item.name }}</p>
          <p v-if="item.price !== 0.5" class="text-xs-center">{{ item.price | formatMoney }}</p>
        </v-flex>
      </v-layout>
    </v-container>
  </transition>
</template>

<style scoped>
</style>

<script>
export default {
  data() {
    return {
      errors: [],
      authenticated: this.$store.state.authenticated,
      fridgeDataOfUser: null,
      items: []
    }
  },
  watch: {
    authenticated: function() {
      this.getFridgeDataOfUser()
    },
    fridgeDataOfUser: {
      handler: function(data, old) {
        this.$axios
          .patch(process.env.API + '/UserModels/' + this.$store.state.user.id, { fridge: data })
          .catch(error => {
            this.fridgeDataOfUser = old
            this.errors.unshift(error)
          })
      },
      deep: true
    }
  },
  created: function() {
    this.getFridgeDataOfUser()
    this.listItems()
  },
  methods: {
    getFridgeDataOfUser() {
      if (!this.$store.state.authenticated) { return }

      let filter = {
        fields: 'fridge'
      }
      this.$axios
        .get(process.env.API + '/UserModels/' + this.$store.state.user.id + '?filter=' + encodeURIComponent(JSON.stringify(filter)))
        .then(response => {
          this.fridgeDataOfUser = response.data.fridge
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    listItems() {
      this.$axios
        .get(process.env.API + '/fridgeItems')
        .then(response => {
          this.items = response.data
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    buy(item) {
      if (!this.$store.state.authenticated) { return }

      let update = Object.assign({}, this.fridgeDataOfUser)

      // Totals
      if (update.total === undefined) { update.total = { items: 0, price: 0 } }
      update.total.items++
      update.total.price = update.total.price + item.price

      // Saldo
      if (update.saldo === undefined) { update.saldo = 0 }
      update.saldo = update.saldo - item.price

      // Items counter
      if (update.items === undefined) { update.items = {} }
      if (update.items[item.slug] === undefined) { update.items[item.slug] = 0 }
      update.items[item.slug]++

      this.fridgeDataOfUser = update
    },
    remove(item) {
      if (!this.$store.state.authenticated) { return }

      let update = Object.assign({}, this.fridgeDataOfUser)

      // Totals
      if (update.total === undefined) { update.total = { items: 0, price: 0 } }
      update.total.items--
      update.total.price = update.total.price - item.price

      // Saldo
      if (update.saldo === undefined) { update.saldo = 0 }
      update.saldo = update.saldo + item.price

      // Items counter
      if (update.items === undefined) { update.items = {} }
      if (update.items[item.slug] === undefined) { update.items[item.slug] = 0 }
      update.items[item.slug]--

      this.fridgeDataOfUser = update
    }
  },
  name: 'Fridge'
}
</script>
