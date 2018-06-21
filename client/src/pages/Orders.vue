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
        <v-flex
          xs12
          v-show="!$store.state.loading && ordersByState(suppliersWithOrders[0].orders, 'ready').length === 0"
        >
          <p>Iedereen is gezonder bezig vandaag, er is nog niets besteld.</p>
          <v-btn class="ml-0" color="primary" flat @click="$router.push('leveranciers')">Maak je keuze</v-btn>
        </v-flex>
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
                <!-- <div v-if="ordersByState(supplier.orders, 'draft') && ordersByState(supplier.orders, 'draft').length > 0">
                  <span
                    v-if="ordersByState(supplier.orders, 'draft').length === 1 &&
                          ordersByState(supplier.orders, 'draft')[0].orderItems &&
                          ordersByState(supplier.orders, 'draft')[0].orderItems.length > 0"
                  >
                    {{ ordersByState(supplier.orders, 'draft')[0].userModel.username }} is aan het bestellen
                  </span>
                  <span
                    v-else-if="ordersByState(supplier.orders, 'draft').length > 1 && order.orderItems.length > 0"
                    v-for="(order, index) in ordersByState(supplier.orders, 'draft')"
                    :key="order.id"
                  >
                    {{ order.userModel.username }}<span v-if="index !== ordersByState(supplier.orders, 'draft').length - 1">, </span>
                    <span v-if="index === ordersByState(supplier.orders, 'draft').length - 1"> zijn aan het bestellen</span>
                  </span>
                </div> -->
              </div>
            </v-card-title>
            <v-card-text class="pb-0">
              <v-list three-line class="pt-1 pb-1">
                <template v-for="(item, itemIndex) in ordersAndActions(ordersByState(supplier.orders, 'ready'), supplier.actions)">
                  <div
                    :key="item.id"
                    :style="item.itemType === 'action' ? 'background-color: #fafafa' : ''"
                    :class="item.itemType === 'action' && item.userModelId !== $store.state.user && $store.state.user.id && !$store.state.isAdmin ? 'actionItem' : ''"
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
                      <v-list-tile-action style="min-width: 40px;">
                        <v-icon color="grey lighten-1">info</v-icon>
                      </v-list-tile-action>
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
                          Gaat<span v-if="item.startDate"> rond {{ item.startDate | formatTime }}</span> bellen naar {{ supplier.name }}
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'call' && item.state === 'inProgress'">
                          Is momenteel aan het bellen met {{ supplier.name }}
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'call' && item.state === 'done'">
                          Heeft gebeld naar {{ supplier.name }}
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'pickup' && item.state === 'todo'">
                          Gaat<span v-if="item.startDate"> rond {{ item.startDate | formatTime }}</span> de bestelling af te halen
                        </v-list-tile-title>
                        <v-list-tile-title v-if="item.type === 'pickup' && item.state === 'inProgress'">
                          Is naar {{ supplier.name }} om de bestelling af te halen
                        </v-list-tile-title>
                        <v-list-tile-sub-title v-if="item.type === 'call' && ($store.state.authenticated && item.userModelId === $store.state.user.id || $store.state.isAdmin)">
                          <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'todo'" small>Moet nog bellen</v-btn>
                          <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'inProgress'" small>Ga nu bellen</v-btn>
                          <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'done'" small>Heb gebeld</v-btn>
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title v-if="item.type === 'pickup' && ($store.state.authenticated && item.userModelId === $store.state.user.id || $store.state.isAdmin)">
                          <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'todo'" small>Moet nog afhalen</v-btn>
                          <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'inProgress'" small>Ga nu afhalen</v-btn>
                          <v-btn color="primary" class="elevation-0 ml-0" v-if="item.state !== 'done'" small>Ben gaan afhalen</v-btn>
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
              <v-btn color="primary" flat @click.stop="deleteOrder = {}; deleteOrderDialog = false">Sluiten</v-btn>
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
              <v-btn color="primary" flat @click.stop="deleteAction = {}; deleteActionDialog = false">Sluiten</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red" flat @click.stop="deleteActionOnAPI()">Verwijderen</v-btn>
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
</style>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      errors: [],
      suppliersWithOrders: [],
      dayOfWeek: new Date().getDay(),
      deleteOrder: {},
      deleteOrderDialog: false,
      deleteAction: {},
      deleteActionDialog: false
    }
  },
  created: function() {
    this.listSuppliersWithOrders()
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
        total += order.price
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
