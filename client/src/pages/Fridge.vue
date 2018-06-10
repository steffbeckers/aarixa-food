<template>
  <transition name="bounce">
    <v-container grid-list-lg fluid>
      <v-dialog v-model="makePaymentDialog" max-width="300px">
        <v-card>
          <v-form 
            ref="paymentForm"
            v-model="paymentFormValid"
            @submit="makePayment"
          >
            <v-card-title>
              <div class="title">Betaling maken</div>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-xs>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field 
                      :rules="paymentRules"
                      type="number"
                      v-model="payment"
                      label="Euro"
                      required
                      clearable
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!paymentFormValid" block color="primary" type="submit">Betalen</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="resetDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <div class="title">Resetten</div>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-xs>
              <v-layout wrap>
                <v-flex xs12>
                  <p>Weet je het zeker dat je je koelkast data wilt resetten?</p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="red" class="white--text" @click="reset()">Ja, ik weet het zeker</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-layout v-if="errors.length > 0" row>
        <v-flex>
          <v-alert :value="true" v-for="(error, index) in errors" :key="index" type="error">
            {{ error.message }}
          </v-alert>
        </v-flex>
      </v-layout>
      <v-layout v-if="!$store.state.authenticated" row wrap>
        <v-flex xs12>
          <v-alert :value="true" type="info" @click.stop="$store.commit('drawer', !$store.state.drawer)">
            Meld je aan om drank uit de koelkast te kopen.
          </v-alert>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex>
          <div class="title">
            Koelkast
            <v-btn v-if="$store.state.authenticated && fridgeDataOfUser" small style="margin-top: 5px; float: right" color="red" flat @click="resetDialog = true">Resetten</v-btn>
          </div>
          <p class="mt-2 mb-0">Alle items aan &euro; 0.50, tenzij anders vermeld.</p>
        </v-flex>
      </v-layout>
      <v-layout v-if="$store.state.authenticated && fridgeDataOfUser" row wrap class="mb-2">
        <v-flex class="pt-0">
          <v-expansion-panel class="elevation-0" id="extraInfo">
            <v-expansion-panel-content :expand-icon="fridgeDataOfUser.total ? 'info' : 'false'">
              <div slot="header" :style="fridgeDataOfUser.total ? 'cursor: pointer' : 'cursor: default'">
                <span>
                  <span class="mr-2">Mijn saldo:</span>
                  <span v-if="fridgeDataOfUser.saldo > 0" style="color: green; font-weight: bold">{{ fridgeDataOfUser.saldo | formatMoney }}</span>
                  <span v-else-if="fridgeDataOfUser.saldo < 0" style="color: red">{{ fridgeDataOfUser.saldo | formatMoney }}</span>
                  <span v-else>&euro; 0.00</span>
                </span>
                <v-btn style="margin-top: 5px" color="primary" flat @click="makePaymentDialog = true">Betalen</v-btn>
              </div>
              <v-container v-if="fridgeDataOfUser.total" grid-list-xl fluid class="pt-0">
                <v-layout row wrap>
                  <v-flex>
                    <span v-if="fridgeDataOfUser.total.items" class="mr-4">Totaal aantal items: <span class="ml-2">{{ fridgeDataOfUser.total.items }}</span></span>
                  </v-flex>
                  <v-flex>
                    <span v-if="fridgeDataOfUser.total.price" class="mr-4">Totaal uitgave: <span class="ml-2">{{ fridgeDataOfUser.total.price | formatMoney }}</span></span>                  
                  </v-flex>
                  <v-flex>
                    <span v-if="fridgeDataOfUser.total.items && fridgeDataOfUser.dateTime">Sinds: <span class="ml-2">{{ fridgeDataOfUser.dateTime | formatDateTime }}</span></span>                  
                  </v-flex>
                </v-layout>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
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
#extraInfo div.expansion-panel__header {
  padding: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      errors: [],
      fridgeDataOfUser: null,
      items: [],
      makePaymentDialog: false,
      payment: null,
      paymentRules: [
        v => !!v || 'Waarde is vereist',
        v => v !== 0 || 'Waarde moet groter of kleiner dan 0 zijn'
      ],
      paymentFormValid: false,
      resetDialog: false
    }
  },
  watch: {
    $route(to, from) {
      this.getFridgeDataOfUser()
      this.listItems()
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

      // Since date time
      if (!update.dateTime) {
        update.dateTime = new Date().toISOString()
      }

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
    },
    makePayment(e) {
      e.preventDefault() // Submit

      // Validation
      if (!this.$refs.paymentForm.validate()) { return }

      let update = Object.assign({}, this.fridgeDataOfUser)

      // Saldo
      if (update.saldo === undefined) { update.saldo = 0 }
      update.saldo = update.saldo + parseFloat(this.payment)

      this.fridgeDataOfUser = update

      this.makePaymentDialog = false
      this.payment = null
    },
    reset() {
      this.fridgeDataOfUser = { dateTime: new Date().toISOString() }
      this.resetDialog = false
    }
  },
  name: 'Fridge'
}
</script>
