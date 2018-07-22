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
      <v-layout row wrap>
        <v-flex xs12>
          <div class="title">Bestellingen</div>
        </v-flex>
        <!-- <v-flex
          xs12
          v-show="!$store.state.loading && suppliersWithOrders.length === 0 || (suppliersWithOrders[0] && ordersByState(suppliersWithOrders[0].orders, 'ready').length === 0)"
        >
          <p>Iedereen is gezonder bezig vandaag, er is nog niets besteld.</p>
          <v-btn class="ml-0" color="primary" flat @click="$router.push('leveranciers')">Maak je keuze</v-btn>
        </v-flex> -->
      </v-layout>
      <v-layout row wrap>
        <v-flex
          xl6
          xs12
          v-for="supplier in suppliersWithOrders" :key="supplier.id"
          v-if="ordersByState(supplier.orders, 'ready').length > 0 && suppliersWithOrders[0].orders.length > 0"
        >
          <v-card>
            <v-card-title primary-title class="pb-0" @click="navigateToSupplier(supplier.slug)">
              <div>
                <h3 class="headline mb-1">{{ supplier.name }}</h3>
                <div>
                  <span v-if="supplier.telephone" class="telephone">{{ supplier.telephone }}</span>
                  <span v-if="supplier.telephone && supplier.website"> - </span>
                  <span v-if="supplier.website" class="website">{{ supplier.website | formatWebsite }}</span>
                </div>
                <div v-if="supplier.openingHours && supplier.openingHours[dayOfWeek]">
                  <span v-for="(timespan, i) in supplier.openingHours[dayOfWeek]" v-bind:key="i">
                    {{ timespan.from }} - {{ timespan.until }}
                  </span>
                </div>
                <div v-else>
                  Vandaag gesloten
                </div>
              </div>
            </v-card-title>
            <v-card-text class="pb-0">
              <!-- <div class="mb-2" v-if="ordersByState(supplier.orders, 'draft') && ordersByState(supplier.orders, 'draft').length > 0">
                  <span
                    v-if="ordersByState(supplier.orders, 'draft').length === 1 &&
                          ordersByState(supplier.orders, 'draft')[0].orderItems &&
                          ordersByState(supplier.orders, 'draft')[0].orderItems.length > 0"
                  >
                <v-icon>info</v-icon> {{ ordersByState(supplier.orders, 'draft')[0].userModel.username }} is aan het bestellen
                  </span>
                  <span
                    v-else-if="ordersByState(supplier.orders, 'draft').length > 1 && order.orderItems.length > 0"
                    v-for="(order, index) in ordersByState(supplier.orders, 'draft')"
                  :key="index"
                  >
                    {{ order.userModel.username }}<span v-if="index !== ordersByState(supplier.orders, 'draft').length - 1">, </span>
                    <span v-if="index === ordersByState(supplier.orders, 'draft').length - 1"> zijn aan het bestellen</span>
                  </span>
                </div> -->
              <div v-if="$store.state.authenticated">
                <v-dialog
                  ref="goingToTimePicker"
                  v-model="showGoingToTimePicker"
                  lazy
                  width="290px"
                >
                  <div slot="activator" d-inline-block class="mr-1">
                    <v-icon @click="actionStateChangeTime = now.format('HH:mm')">access_time</v-icon>
                  </div>
                  <v-time-picker
                    v-model="goingToTime"
                    format="24hr"
                    scrollable
                    :min="now.format('HH:mm')"
                  >
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="goingToTime = null; showGoingToTimePicker = false">Resetten</v-btn>
                    <v-btn flat color="primary" @click="showGoingToTimePicker = false">Kies tijd</v-btn>
                  </v-time-picker>
                </v-dialog>
                <v-btn v-if="!goingToTime" @click="callNow(supplier)" color="primary" class="elevation-0 ml-0" small>Ga nu bellen</v-btn>
                <v-btn v-if="goingToTime" @click="scheduleCall(supplier)" color="primary" class="elevation-0 ml-0" small>Ga bellen om {{ goingToTime }}</v-btn>
                <v-btn v-if="!goingToTime" @click="pickUpNow(supplier)" color="primary" class="elevation-0 ml-0" small>Ga nu afhalen</v-btn>
                <v-btn v-if="goingToTime" @click="schedulePickUp(supplier)" color="primary" class="elevation-0 ml-0" small>Ga afhalen om {{ goingToTime }}</v-btn>
              </div>
              <v-list three-line class="pt-1 pb-1">
                <template v-for="(item, itemIndex) in ordersAndActions(ordersByState(supplier.orders, 'ready'), supplier.actions)">
                  <div
                    :key="item.id"
                    :style="item.itemType === 'action' ? 'background-color: #efefef' : ''"
                    :class="
                      (item.itemType === 'action' && !$store.state.authenticated) ||
                      (item.itemType === 'action' && $store.state.authenticated && item.userModelId !== $store.state.user.id) &&
                      !$store.state.isAdmin ? 'actionItem' : ''"
                  >
                    <v-divider v-if="itemIndex === 0"></v-divider>
                    <v-list-tile v-if="item.itemType === 'order'">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.userModel.username }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="item.updatedOn">{{ item.updatedOn | formatTime }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title v-if="item.price > 0">{{ item.price | formatMoney }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-content v-for="(item, itemIndex) in item.orderItems" :key="itemIndex">
                        <v-list-tile-title v-if="item.menuItem">
                          <span v-if="item.quantity > 1">{{ item.quantity }} </span>
                          <span v-if="item.selectedType && item.quantity > 1">{{ item.menuItem.types[item.selectedType].namePlural }}</span>
                          <span v-if="item.selectedType && item.quantity === 1">{{ item.menuItem.types[item.selectedType].name }}</span>
                          <span v-if="!item.selectedType && item.quantity > 1">{{ item.menuItem.namePlural }}</span>
                          <span v-if="!item.selectedType && item.quantity === 1">{{ item.menuItem.name }}</span>
                          <span v-if="item.subItems.length > 0">{{ subItemsListing(item) }}</span>
                        </v-list-tile-title>
                        <v-list-tile-title v-else-if="item.info">
                          {{ item.info }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title class="text--primary" v-if="item.menuItem && item.info && !item.editInfo">{{ item.info }}</v-list-tile-sub-title>
                        <v-list-tile-sub-title v-if="item.menuItem && item.menuItem.category">{{ item.menuItem.category }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <!-- <v-list-tile-action v-if="$store.state.authenticated && $store.state.user && item.userModelId === $store.state.user.id">
                        <v-btn icon ripple>
                          <v-icon color="grey lighten-1">edit</v-icon>
                        </v-btn>
                      </v-list-tile-action> -->
                      <v-list-tile-action
                        v-if="($store.state.authenticated && item.userModelId === $store.state.user.id) || $store.state.isAdmin"
                        @click="deleteOrder = item; deleteOrderDialog = true"
                      >
                        <v-btn icon ripple>
                          <v-icon color="grey lighten-1">delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-else-if="item.itemType === 'action'" :key="itemIndex">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.userModel.username }}
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="item.updatedOn">
                          <span v-if="item.startDate">{{ item.startDate | formatTime }}</span>
                          <span v-else>{{ item.updatedOn | formatTime }}</span>
                          <span v-if="item.endDate"> - {{ item.endDate | formatTime }}</span>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-content>
                        <v-list-tile-title v-if="item.type === 'call' && item.state === 'todo'">
                          Gaat<span v-if="item.startDate"> rond {{ item.startDate | formatTime }}</span> bellen naar {{ supplier.name }}.
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'call' && item.state === 'inProgress'">
                          Is momenteel aan het bellen met {{ supplier.name }}.
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'call' && item.state === 'done'">
                          Heeft gebeld naar {{ supplier.name }}<span v-if="item.result.delivery">. Er wordt <span v-if="item.result.time">rond {{ item.result.time }} </span>geleverd</span><span v-else>. Iemand mag <span v-if="item.result.time">rond {{ item.result.time }} </span>afhalen</span>.
                          <v-icon v-if="$store.state.isAdmin || $store.state.authenticated && item.userModelId === $store.state.user.id" small @click="afterCallSupplier = supplier; afterCallAction = item; afterCallActionDialog = true">edit</v-icon>
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'pickUp' && item.state === 'todo'">
                          Gaat<span v-if="item.startDate"> rond {{ item.startDate | formatTime }}</span> de bestelling afhalen.
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'pickUp' && item.state === 'inProgress'">
                          Is naar {{ supplier.name }} om de bestelling af te halen.
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'pickUp' && item.state === 'done'">
                          Smakelijk! <span v-if="item.result.paidBy">{{ item.result.paidBy }} heeft betaald.</span>
                          <v-icon v-if="$store.state.isAdmin || $store.state.authenticated && item.userModelId === $store.state.user.id" small @click="afterPickUpSupplier = supplier; afterPickUpAction = item; afterPickUpActionDialog = true">edit</v-icon>
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="item.info">
                          {{ item.info }}
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title v-if="$store.state.isAdmin || $store.state.authenticated && item.userModelId === $store.state.user.id">
                          <v-dialog
                            ref="actionStateChangeTimePicker"
                            v-model="showActionStateChangeTimePicker"
                            lazy
                            width="290px"
                          >
                            <div slot="activator" d-inline-block class="mr-1">
                              <v-icon @click="actionStateChangeTime = now.format('HH:mm')">access_time</v-icon>
                            </div>
                            <v-time-picker
                              v-model="actionStateChangeTime"
                              format="24hr"
                              scrollable
                              :min="now.format('HH:mm')"
                            >
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="actionStateChangeTime = null; showActionStateChangeTimePicker = false">Resetten</v-btn>
                              <v-btn flat color="primary" @click="showActionStateChangeTimePicker = false">Kies tijd</v-btn>
                            </v-time-picker>
                          </v-dialog>
                          <template v-if="item.type === 'call'">
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="!actionStateChangeTime && item.state !== 'todo'" @click="updateStateOfAction(item, 'todo')" small>Moet nog bellen</v-btn>
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="actionStateChangeTime && item.state !== 'todo'" @click="updateStateOfAction(item, 'todo')" small>Ga bellen om {{ actionStateChangeTime }}</v-btn>
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'inProgress'" @click="updateStateOfAction(item, 'inProgress')" small>Ga nu bellen</v-btn>
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'done'" @click="updateStateOfAction(item, 'done', supplier)" small>Heb gebeld<span v-show="actionStateChangeTime">&nbsp;om {{ actionStateChangeTime }}</span></v-btn>
                          </template>
                          <template v-if="item.type === 'pickUp'">
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'todo'" @click="updateStateOfAction(item, 'todo')" small>Moet nog afhalen</v-btn>
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'inProgress'" @click="updateStateOfAction(item, 'inProgress')" small>Ga nu afhalen</v-btn>
                            <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'done'" @click="updateStateOfAction(item, 'done', supplier)" small>Ben gaan afhalen</v-btn>
                          </template>
                        </v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action
                        v-if="($store.state.authenticated && $store.state.user && item.userModelId === $store.state.user.id) || $store.state.isAdmin"
                        @click="deleteAction = item; deleteActionDialog = true"
                      >
                        <v-btn icon ripple>
                          <v-icon color="grey lighten-1">delete</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider></v-divider>
                  </div>
                </template>
                <v-list-tile-title class="mt-2" v-if="totalOfAllOrdersPerSupplier(supplier) > 0">Totaal: {{ totalOfAllOrdersPerSupplier(supplier) | formatMoney }}</v-list-tile-title>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="supplier.telephone"
                :href="'tel:' + supplier.telephone"
                flat
              >
                Bellen
              </v-btn>
              <v-btn
                v-if="supplier.website"
                :href="supplier.website"
                target="_blank"
                flat
              >
                Website
              </v-btn>
              <v-btn
                v-if="supplier.address && supplier.address.googleMapsLink"
                :href="supplier.address.googleMapsLink"
                target="_blank"
                flat
              >
                Maps
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-dialog v-if="deleteOrder && deleteOrder.id" v-model="deleteOrderDialog" max-width="250px">
          <v-card>
            <v-card-title>
              <div class="title">Bestelling verwijderen?</div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat @click.stop="deleteOrder = {}; deleteOrderDialog = false">Sluiten</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" flat @click.stop="deleteOrderOnAPI()">Verwijderen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-if="deleteAction && deleteAction.id" v-model="deleteActionDialog" max-width="250px">
          <v-card>
            <v-card-title>
              <div class="title">Actie verwijderen?</div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat @click.stop="deleteAction = {}; deleteActionDialog = false">Sluiten</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" flat @click.stop="deleteActionOnAPI()">Verwijderen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-if="afterCallAction && afterCallAction.id" v-model="afterCallActionDialog" max-width="350px" persistent>
          <v-card>
            <v-card-title>
              <div class="title">Telefoongesprek met {{ afterCallSupplier.name }}</div>
            </v-card-title>
            <v-card-text class="text-xs-center">
              <v-switch
                :label="`Wordt er geleverd?`"
                v-model="afterCallAction.result.delivery"
              ></v-switch>
              <p class="text-xs-left mb-2" style="color: rgba(0,0,0,.54); font-size: 16px">Om hoe laat <span v-if="afterCallAction.result.delivery">levert men</span><span v-else>afhalen</span>?</p>
              <v-spacer></v-spacer>
              <v-time-picker
                v-model="afterCallAction.result.time"
                format="24hr"
                max-width="200px"
                scrollable
              ></v-time-picker>
              <v-text-field class="mt-1" v-model="afterCallAction.info" rows="2" multi-line label="Info" clearable></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click.stop="afterCallAction = {}; afterCallActionDialog = false">Sluiten</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.stop="saveAfterCallActionOnAPI()">Opslaan</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-if="afterPickUpAction && afterPickUpAction.id" v-model="afterPickUpActionDialog" max-width="350px" persistent>
          <v-card>
            <v-card-title>
              <div class="title">Smakelijk!</div>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="afterPickUpAction.result.paidBy" label="Wie heeft er betaald?" clearable></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click.stop="afterPickUpAction = {}; afterPickUpActionDialog = false">Sluiten</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.stop="saveAfterPickUpActionOnAPI()">Opslaan</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </transition>
</template>

<style scoped>
.card__title > div {
  cursor: pointer;
}

.list__tile__title {
  height: auto;
  max-height: 72px;
  white-space: normal;
  min-width: 75px;
}

.list__tile__sub-title {
  height: auto;
  max-height: 72px;
  white-space: normal;
}
</style>

<script>
import _ from 'lodash'
import moment from 'moment'

// Realtime updates
let orderStream
let actionStream

export default {
  data() {
    return {
      errors: [],
      suppliersWithOrders: [],
      // Dates
      dayOfWeek: new Date().getDay(),
      now: moment(),
      // Deletes
      deleteOrder: {},
      deleteOrderDialog: false,
      deleteAction: {},
      deleteActionDialog: false,
      // Time pickers
      goingToTime: null,
      showGoingToTimePicker: false,
      actionStateChangeTime: null,
      showActionStateChangeTimePicker: false,
      // Popup after call action
      afterCallActionDialog: false,
      afterCallAction: {},
      afterCallSupplier: {},
      // Popup after pick up action
      afterPickUpActionDialog: false,
      afterPickUpAction: {},
      afterPickUpSupplier: {}
    }
  },
  created: function() {
    this.listSuppliersWithOrders()
  },
  mounted: function() {
    // Update Orders realtime
    this.$sse(process.env.API + '/Orders/change-stream?_format=event-stream', {format: 'json'}).then(sse => {
      // Store SSE object at a higher scope
      orderStream = sse

      // Listen for messages based on their event
      sse.subscribe('data', (event) => {
        console.log(event)

        // Check when we don't need an update
        if (event.type === 'create' && event.data.state === 'draft') return

        this.listSuppliersWithOrders()
      })
    }).catch(err => {
      // When this error is caught, it means the initial connection to the
      // events server failed.  No automatic attempts to reconnect will be made.
      console.error('Failed to connect to server', err)
    })

    // Update Actions realtime
    this.$sse(process.env.API + '/Actions/change-stream?_format=event-stream', {format: 'json'}).then(sse => {
      // Store SSE object at a higher scope
      actionStream = sse

      // Listen for messages based on their event
      sse.subscribe('data', (event) => {
        console.log(event)

        this.listSuppliersWithOrders()
      })
    }).catch(err => {
      // When this error is caught, it means the initial connection to the
      // events server failed.  No automatic attempts to reconnect will be made.
      console.error('Failed to connect to server', err)
    })
  },
  beforeDestroy() {
    // Update Orders realtime
    if (orderStream) orderStream.close()
    // Update Actions realtime
    if (actionStream) actionStream.close()
  },
  methods: {
    listSuppliersWithOrders() {
      this.$axios
        .get(process.env.API + '/Suppliers/todaysOrders')
        .then(response => {
          this.suppliersWithOrders = response.data
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    navigateToSupplier(slug) {
      this.$router.push({ name: 'SupplierDetail', params: { slug: slug } })
    },
    totalOfAllOrdersPerSupplier(supplier) {
      let total = 0
      supplier.orders.forEach(order => {
        if (order.state === 'ready' && order.price) total += order.price
      })
      return total
    },
    ordersByState(orders, state) {
      return _.filter(orders, function(order) {
        if (order.state === state) return order
      })
    },
    ordersAndActions(orders, actions) {
      orders = Object.assign([], orders)
      orders = _.map(orders).map(function(o) {
        return _.assign(o, { itemType: 'order' })
      })

      actions = Object.assign([], actions)
      actions = _.map(actions).map(function(o) {
        return _.assign(o, { itemType: 'action' })
      })

      let array = [...orders, ...actions]
      return _.orderBy(array, function(o) {
        return o.startDate || o.updatedOn
      }, ['desc'])
    },
    callNow(supplier) {
      this.$axios
        .post(process.env.API + '/Suppliers/' + supplier.id + '/actions', {
          type: 'call',
          state: 'inProgress'
        })
        .then(response => {
          supplier.actions.unshift({
            ...response.data,
            userModel: {
              username: this.$store.state.user.username
            }
          })
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    pickUpNow(supplier) {
      this.$axios
        .post(process.env.API + '/Suppliers/' + supplier.id + '/actions', {
          type: 'pickUp',
          state: 'inProgress'
        })
        .then(response => {
          supplier.actions.unshift({
            ...response.data,
            userModel: {
              username: this.$store.state.user.username
            }
          })
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    scheduleCall(supplier) {
      this.$axios
        .post(process.env.API + '/Suppliers/' + supplier.id + '/actions', {
          startDate: moment(this.goingToTime, 'HH:mm').toISOString(),
          type: 'call',
          state: 'todo'
        })
        .then(response => {
          supplier.actions.unshift({
            ...response.data,
            userModel: {
              username: this.$store.state.user.username
            }
          })

          this.goingToTime = null
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    schedulePickUp(supplier) {
      this.$axios
        .post(process.env.API + '/Suppliers/' + supplier.id + '/actions', {
          startDate: moment(this.goingToTime, 'HH:mm').toISOString(),
          type: 'pickUp',
          state: 'todo'
        })
        .then(response => {
          supplier.actions.unshift({
            ...response.data,
            userModel: {
              username: this.$store.state.user.username
            }
          })

          this.goingToTime = null
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    updateStateOfAction(action, state, supplier = null) {
      // If the action has a start date and the state is inProgress or done, update the start date to now
      if ((state === 'inProgress' || state === 'done') && action.startDate) {
        action.startDate = moment().toISOString()
      }

      // If now, at this moment the action is happening it can't be scheduled
      if (state === 'inProgress') {
        this.actionStateChangeTime = null
      }

      // If time is provided, overwrite state time
      if (this.actionStateChangeTime) {
        action.startDate = moment(this.actionStateChangeTime, 'HH:mm').toISOString()
      }

      this.$axios
        .patch(process.env.API + '/Actions/' + action.id, {
          startDate: action.startDate,
          state: state
        })
        .then(response => {
          action.state = response.data.state

          // After call action
          if (action.type === 'call' && action.state === 'done') {
            this.afterCallSupplier = supplier
            this.afterCallAction = action
            this.afterCallAction.result = { delivery: false, time: this.now.add(30, 'minutes').format('HH:mm') }
            this.afterCallActionDialog = true
          }

          // After pick up action
          if (action.type === 'pickUp' && action.state === 'done') {
            this.afterPickUpSupplier = supplier
            this.afterPickUpAction = action
            this.afterPickUpAction.result = { paidBy: this.$store.state.user.username }
            this.afterPickUpActionDialog = true
          }

          this.actionStateChangeTime = null
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    saveAfterCallActionOnAPI() {
      this.$axios
        .patch(process.env.API + '/Actions/' + this.afterCallAction.id, {
          result: this.afterCallAction.result,
          info: this.afterCallAction.info
        })
        .then(response => {
          this.afterCallSupplier = {}
          this.afterCallAction = {}
          this.afterCallAction.result = { delivery: false, time: null }
          this.afterCallActionDialog = false
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    saveAfterPickUpActionOnAPI() {
      this.$axios
        .patch(process.env.API + '/Actions/' + this.afterPickUpAction.id, {
          result: this.afterPickUpAction.result,
          info: this.afterPickUpAction.info
        })
        .then(response => {
          this.afterPickUpSupplier = {}
          this.afterPickUpAction = {}
          this.afterPickUpAction.result = { paidBy: this.$store.state.user.username }
          this.afterPickUpActionDialog = false
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    subItemsListing(item) {
      let list = 'met '

      for (let i = 0; i < item.subItems.length; i++) {
        const subItem = item.subItems[i]
        // Add comma or end with ampersand
        if (item.subItems.length > 1 && i === item.subItems.length - 1) {
          list += ' & '
        } else if (i > 0) {
          list += ', '
        }
        list += subItem.name || subItem
      }

      return list
    },
    deleteOrderOnAPI() {
      this.$axios
        .delete(process.env.API + '/Orders/' + this.deleteOrder.id)
        .then(response => {
          // Remove from listing
          let supplierIndex = this.suppliersWithOrders.findIndex(supplier => {
            return supplier.id === this.deleteOrder.supplierId
          })
          let orderIndex = this.suppliersWithOrders[supplierIndex].orders.findIndex(order => {
            return order.id === this.deleteOrder.id
          })
          this.suppliersWithOrders[supplierIndex].orders.splice(orderIndex, 1)

          // Disable dialog
          this.deleteOrder = {}
          this.deleteOrderDialog = false
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    deleteActionOnAPI() {
      this.$axios
        .delete(process.env.API + '/Actions/' + this.deleteAction.id)
        .then(response => {
          // Remove from listing
          let supplierIndex = this.suppliersWithOrders.findIndex(supplier => {
            return supplier.id === this.deleteAction.supplierId
          })
          let actionIndex = this.suppliersWithOrders[supplierIndex].actions.findIndex(action => {
            return action.id === this.deleteAction.id
          })
          this.suppliersWithOrders[supplierIndex].actions.splice(actionIndex, 1)

          // Disable dialog
          this.deleteAction = {}
          this.deleteActionDialog = false
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    }
  },
  name: 'Suppliers'
}
</script>
