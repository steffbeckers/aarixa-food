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
      <v-layout row>
        <v-flex>
          <div class="title">Bestellingen</div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          xs12
          v-if="!$store.state.loading && (suppliersWithOrders.length === 0 || suppliersWithOrders[0].orders.length === 0)"
        >
          <p>Iedereen is gezonder bezig vandaag, er is nog niets besteld.</p>
          <v-btn class="ml-0" color="primary" flat @click="$router.push('leveranciers')">Maak je keuze</v-btn>
        </v-flex>
        <v-flex
          xl6
          xs12
          v-for="supplier in suppliersWithOrders" :key="supplier.id"
          v-if="supplier.orders.length > 0 && suppliersWithOrders[0].orders.length > 0"
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
              <v-list three-line class="pt-1 pb-1">
                <template v-for="(order, orderIndex) in supplier.orders">
                  <v-divider v-if="orderIndex === 0" :key="order.id"></v-divider>     
                  <v-list-tile :key="orderIndex">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{ order.userModel.username }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title v-if="order.updatedOn">{{ order.updatedOn | formatTime }} <v-icon small v-html="'done'"></v-icon></v-list-tile-sub-title>
                      <v-list-tile-sub-title v-if="order.price > 0">{{ order.price | formatMoney }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-content v-for="(item, itemIndex) in order.orderItems" :key="itemIndex">
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
                    <!-- <v-list-tile-action v-if="$store.state.authenticated && order.userModelId === $store.state.user.id">
                      <v-btn icon ripple>
                        <v-icon color="grey lighten-1">edit</v-icon>
                      </v-btn>
                    </v-list-tile-action> -->
                    <v-list-tile-action 
                      v-if="$store.state.authenticated && order.userModelId === $store.state.user.id"
                      @click="deleteOrder = order; deleteOrderDialog = true"
                    >
                      <v-btn icon ripple>
                        <v-icon color="grey lighten-1">delete</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider :key="order.updatedOn"></v-divider>
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
        <v-dialog v-if="deleteOrder.id" v-model="deleteOrderDialog" max-width="250px">
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
export default {
  data() {
    return {
      errors: [],
      suppliersWithOrders: [],
      dayOfWeek: new Date().getDay(),
      deleteOrder: {},
      deleteOrderDialog: false
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
    }
  },
  name: 'Suppliers'
}
</script>
