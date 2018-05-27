<template>
  <v-container grid-list-lg fluid>
    <v-layout v-show="loading" row class="mt-3 mb-3">
      <v-layout
        column
        align-center
      >
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-layout>
    </v-layout>
    <v-layout row>
      <v-flex>
        <div class="title">Bestellingen</div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        xl6
        xs12
        v-for="supplier in suppliersWithOrders" :key="supplier.id"
      >
        <v-card>
          <v-card-title primary-title class="pb-0">
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
            <v-list three-line>
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
                    <v-list-tile-title>
                      <span v-if="item.quantity > 1">{{ item.quantity }} </span>
                      <span v-if="item.quantity > 1 && item.menuItem.namePlural">{{ item.menuItem.namePlural }}</span>
                      <span v-else>{{ item.menuItem.name }}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary" v-if="item.info">{{ item.info }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>{{ item.menuItem.category }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <!-- <v-list-tile-action v-if="$store.state.authenticated && order.userModelId === $store.state.user.id">
                    <v-btn icon ripple>
                      <v-icon color="grey lighten-1">edit</v-icon>
                    </v-btn>
                  </v-list-tile-action> -->
                  <v-list-tile-action v-if="$store.state.authenticated && order.userModelId === $store.state.user.id">
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
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      suppliersWithOrders: [],
      dayOfWeek: new Date().getDay()
    }
  },
  mounted: function() {
    this.listSuppliersWithOrders()
  },
  methods: {
    listSuppliersWithOrders() {
      this.loading = true
      this.$axios
        .get(process.env.API + '/suppliers/todaysOrders')
        .then(response => {
          this.loading = false
          this.suppliersWithOrders = response.data
          console.log(this.suppliersWithOrders)
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    totalOfAllOrdersPerSupplier(supplier) {
      let total = 0
      supplier.orders.forEach(order => {
        total += order.price
      })
      return total
    }
  },
  name: 'Suppliers'
}
</script>
