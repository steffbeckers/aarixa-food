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
          <v-alert :value="true" type="info" @click.stop="$store.commit('drawer', true)">
            Meld je aan om drank uit de koelkast te kopen.
          </v-alert>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex>
          <div class="title">
            Koelkast
            <v-btn v-if="$store.state.authenticated && fridgeDataOfUser && fridgeDataOfUser.saldo !== undefined" small style="margin-top: 5px; float: right" color="red" flat @click="resetDialog = true">Resetten</v-btn>
          </div>
          <p class="mt-2 mb-0">Alle items aan &euro; 0.50, tenzij anders vermeld.</p>
        </v-flex>
      </v-layout>
      <v-layout v-if="$store.state.authenticated && fridgeDataOfUser" row wrap class="mb-2">
        <v-flex class="pt-0">
          <v-expansion-panel class="elevation-0" id="extraInfo">
            <v-expansion-panel-content :expand-icon="fridgeDataOfUser.saldo !== undefined ? 'info' : 'false'">
              <div slot="header" :style="fridgeDataOfUser.saldo !== undefined ? 'cursor: pointer' : 'cursor: default'">
                <span>
                  <span class="mr-2">Mijn saldo:</span>
                  <span v-if="fridgeDataOfUser.saldo > 0" style="color: green; font-weight: bold">{{ fridgeDataOfUser.saldo | formatMoney }}</span>
                  <span v-else-if="fridgeDataOfUser.saldo < 0" style="color: red;">{{ fridgeDataOfUser.saldo | formatMoney }}</span>
                  <span v-else>&euro; 0.00</span>
                </span>
                <v-btn style="margin-top: 5px" color="primary" flat @click="makePaymentDialog = true">Betalen</v-btn>
              </div>
              <v-container v-if="fridgeDataOfUser.saldo !== undefined" grid-list-xl fluid class="pt-0">
                <v-layout v-if="fridgeDataOfUser.total || fridgeDataOfUser.dateTime" row wrap>
                  <v-flex v-if="fridgeDataOfUser.total">
                    <span v-if="fridgeDataOfUser.total.items" class="mr-4">Totaal aantal items: <span class="ml-2">{{ fridgeDataOfUser.total.items }}</span></span>
                  </v-flex>
                  <v-flex v-if="fridgeDataOfUser.total">
                    <span v-if="fridgeDataOfUser.total.price" class="mr-4">Totaal uitgave: <span class="ml-2">{{ fridgeDataOfUser.total.price | formatMoney }}</span></span>                  
                  </v-flex>
                  <v-flex>
                    <span v-if="fridgeDataOfUser.dateTime">Sinds: <span class="ml-2">{{ fridgeDataOfUser.dateTime | formatDateTime }}</span></span>                  
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex
                    v-if="fridgeDataOfUser.payments"
                    xs12
                  >
                    Betalingen
                    <table id="payments" cellspacing="0px" class="mt-2" style="min-width: 350px;">
                      <thead>
                        <tr>
                          <th>Datum & tijd</th>
                          <th>Saldo</th>
                          <th>Waarde</th>
                          <th>Nieuw saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(payment, i) in fridgeDataOfUser.payments" :key="i">
                          <td>{{ payment.dateTime | formatDateTime }}</td>
                          <td v-if="payment.saldo.old">{{ payment.saldo.old | formatMoney }}</td>
                          <td v-else></td>
                          <td>{{ payment.value | formatMoney }}</td>
                          <td>
                            <span v-if="payment.saldo.new > 0" style="color: green; font-weight: bold">{{ payment.saldo.new | formatMoney }}</span>
                            <span v-else-if="payment.saldo.new < 0" style="color: red;">{{ payment.saldo.new | formatMoney }}</span>
                            <span v-else>&euro; 0.00</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-flex>
                  <v-flex v-else>
                    Betalingen
                    <p class="mb-0 mt-2">Je hebt nog geen betalingen gedaan.</p>
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
#payments td, th {
  padding-right: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      errors: [],
      fridgeDataOfUser: {},
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
      this.listItems()
      this.getFridgeDataOfUser()
    }
  },
  created: function() {
    this.listItems()
    this.getFridgeDataOfUser()
  },
  methods: {
    listItems() {
      this.$axios
        .get(process.env.API + '/fridgeItems')
        .then(response => {
          if (response.data) this.items = response.data
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    async getFridgeDataOfUser() {
      if (!this.$store.state.authenticated) { return }

      let filter = {
        fields: 'fridge'
      }
      await this.$axios
        .get(process.env.API + '/UserModels/' + this.$store.state.user.id + '?filter=' + encodeURIComponent(JSON.stringify(filter)))
        .then(response => {
          if (response.data) this.fridgeDataOfUser = response.data.fridge
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    updateFridgeDataOfUser() {
      if (!this.$store.state.authenticated) { return }

      this.$axios
        .patch(process.env.API + '/UserModels/' + this.$store.state.user.id, { fridge: this.fridgeDataOfUser })
        .then(response => {
          if (response.data) this.fridgeDataOfUser = response.data.fridge
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    async buy(item) {
      if (!this.$store.state.authenticated) { return }

      // Retrieve latest data
      await this.getFridgeDataOfUser()

      // Since date time
      if (!this.fridgeDataOfUser.dateTime) {
        this.fridgeDataOfUser.dateTime = new Date().toISOString()
      }

      // Totals
      if (this.fridgeDataOfUser.total === undefined) { this.fridgeDataOfUser.total = { items: 0, price: 0 } }
      this.fridgeDataOfUser.total.items++
      this.fridgeDataOfUser.total.price = this.fridgeDataOfUser.total.price + item.price

      // Saldo
      if (this.fridgeDataOfUser.saldo === undefined) { this.fridgeDataOfUser.saldo = 0 }
      this.fridgeDataOfUser.saldo = this.fridgeDataOfUser.saldo - item.price

      // Items counter
      if (this.fridgeDataOfUser.items === undefined) { this.fridgeDataOfUser.items = {} }
      if (this.fridgeDataOfUser.items[item.slug] === undefined) { this.fridgeDataOfUser.items[item.slug] = 0 }
      this.fridgeDataOfUser.items[item.slug]++

      // Update data
      this.updateFridgeDataOfUser()
    },
    async remove(item) {
      if (!this.$store.state.authenticated) { return }

      // Retrieve latest data
      await this.getFridgeDataOfUser()

      // Totals
      if (this.fridgeDataOfUser.total === undefined) { this.fridgeDataOfUser.total = { items: 0, price: 0 } }
      this.fridgeDataOfUser.total.items--
      this.fridgeDataOfUser.total.price = this.fridgeDataOfUser.total.price - item.price

      // Saldo
      if (this.fridgeDataOfUser.saldo === undefined) { this.fridgeDataOfUser.saldo = 0 }
      this.fridgeDataOfUser.saldo = this.fridgeDataOfUser.saldo + item.price

      // Items counter
      if (this.fridgeDataOfUser.items === undefined) { this.fridgeDataOfUser.items = {} }
      if (this.fridgeDataOfUser.items[item.slug] === undefined) { this.fridgeDataOfUser.items[item.slug] = 0 }
      this.fridgeDataOfUser.items[item.slug]--

      // Update data
      this.updateFridgeDataOfUser()
    },
    async makePayment(e) {
      e.preventDefault() // Submit

      if (!this.$store.state.authenticated || !this.$refs.paymentForm.validate()) { return }

      // Retrieve latest data
      await this.getFridgeDataOfUser()

      // To keep track of payments
      let paymentObject = {
        dateTime: new Date().toISOString(),
        value: parseFloat(this.payment),
        saldo: { old: null, new: null }
      }

      // Save old saldo
      if (this.fridgeDataOfUser.saldo) paymentObject.saldo.old = this.fridgeDataOfUser.saldo

      // Copy without references
      paymentObject = Object.assign({}, paymentObject)

      // Saldo
      if (this.fridgeDataOfUser.saldo === undefined) { this.fridgeDataOfUser.saldo = 0 }
      this.fridgeDataOfUser.saldo = this.fridgeDataOfUser.saldo + parseFloat(this.payment)

      // Save new saldo
      if (this.fridgeDataOfUser.saldo) paymentObject.saldo.new = this.fridgeDataOfUser.saldo

      // Payments
      if (this.fridgeDataOfUser.payments === undefined) { this.fridgeDataOfUser.payments = [] }
      this.fridgeDataOfUser.payments.unshift(paymentObject)

      // Update data
      await this.updateFridgeDataOfUser()

      this.makePaymentDialog = false
      this.payment = null
    },
    async reset() {
      this.fridgeDataOfUser = { dateTime: new Date().toISOString() }

      // Update data
      await this.updateFridgeDataOfUser()

      this.resetDialog = false
    }
  },
  name: 'Fridge'
}
</script>
