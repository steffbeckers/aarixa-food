<template>
  <v-container grid-list-lg fluid>
    <v-layout v-show="loading" row class="mb-3">
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
        xl3
        lg6
        md12
        v-for="supplier in suppliersWithOrders" :key="supplier.id"
      >
        <v-card>
          <v-card-title primary-title class="pb-0">
            <h3 class="headline">{{ supplier.name }}</h3>
          </v-card-title>
          <v-card-text>
            <v-list v-for="order in supplier.orders" two-line cl :key="order.id">
              <v-list-tile-title>{{ order.userModel.username }}</v-list-tile-title>
              <template v-for="(item, index) in order.orderItems">
                <v-list-tile
                  :key="item.id"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span v-if="item.quantity > 1">{{ item.quantity }} </span>
                      <span v-if="item.quantity > 1 && item.menuItem.namePlural">{{ item.menuItem.namePlural }}</span>
                      <span v-else>{{ item.menuItem.name }}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary" v-if="item.info">{{ item.info }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>{{ item.menuItem.category }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-title v-if="item.quantity === 1">{{ item.menuItem.price | formatMoney }}</v-list-tile-title>                  
                    <v-list-tile-title v-if="item.quantity > 1">{{ item.menuItem.price * item.quantity | formatMoney }}</v-list-tile-title>
                    <v-list-tile-sub-title v-if="item.quantity > 1">
                      {{ item.menuItem.price | formatMoney }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider class="mt-2 mb-2" v-if="index + 1 < order.orderItems.length" :key="index"></v-divider>
              </template>
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
// import moment from 'moment'

export default {
  data () {
    return {
      loading: false,
      suppliersWithOrders: []
    }
  },
  mounted: function () {
    this.listSuppliersWithOrders()
  },
  methods: {
    listSuppliersWithOrders () {
      this.loading = true
      this.$axios.get(process.env.API + '/suppliers/todaysOrders')
        .then(response => {
          this.loading = false
          this.suppliersWithOrders = response.data
          console.log(this.suppliersWithOrders)
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    }
  },
  name: 'Suppliers'
}
</script>
