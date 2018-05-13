<template>
  <v-ons-page>
    <v-ons-toolbar class="home-toolbar">
      <div class="left">
        <v-ons-toolbar-button @click="$store.commit('splitter/toggle')">
          <v-ons-icon icon="fa-bars"></v-ons-icon>
        </v-ons-toolbar-button>
      </div>
      <div class="center">aariXaFood<span v-if="!onLine"> - Offline</span></div>
      <div class="right" style="padding-right: 15px;" :v-if="$cookie.get('$aariXaFood$token')">
        {{ $cookie.get('$aariXaFood$username') }}
      </div>
    </v-ons-toolbar>

    <div class="content">    
      <v-ons-pull-hook :action="listOrdersPerSupplierOnHomepage" @changestate="pullHookState = $event.state">
        <span v-show="pullHookState === 'initial'">Sleep om te vernieuwen</span>
        <span v-show="pullHookState === 'preaction'">Loslaten</span>
        <span v-show="pullHookState === 'action'"><v-ons-progress-circular indeterminate></v-ons-progress-circular></span>
      </v-ons-pull-hook>

      <v-ons-list-title>Bestellingen</v-ons-list-title>
      <p style="padding-left: 16px;" v-show="Object.keys(suppliers).length === 0">Iedereen is gezonder bezig vandaag. <v-ons-icon icon="fa-thumbs-up"></v-ons-icon> Er zijn nog geen bestellingen.</p>
      <v-ons-list v-for="(supplier, supplierId) in suppliers" :key="supplierId">
        <v-ons-list-header style="cursor: pointer">{{ supplier[0].supplier.name }}<span> - {{ supplier[0].createdOn | formatDate }}</span></v-ons-list-header>
        <v-ons-list-item modifier="longdivider">
          <v-ons-list v-for="order in supplier" :key="order.id" modifier="inset">
            <v-ons-list-header>
              {{ order.userModel.username }} <span v-if="order.updatedOn"> - {{ order.updatedOn | formatTime }}</span>
            </v-ons-list-header>
            <v-ons-list-item v-for="item in order.orderItems" :key="item.id" modifier="longdivider">
              <span class="list-item__title">
                <span v-if="item.quantity > 1">{{ item.quantity }} </span>
                <span v-if="item.quantity > 1 && item.menuItem.namePlural">{{ item.menuItem.namePlural }}</span><span v-else-if="item.menuItem.name">{{ item.menuItem.name }}</span>
                <span v-if="item.price"> - &euro; {{ item.price }}</span><br v-if="item.info" />
                <span class="list-item__info" v-if="item.info">{{ item.info }}</span>
              </span>
              <span v-if="item.menuItem.category" class="list-item__subtitle"><v-ons-icon icon="fa-list-alt"></v-ons-icon> {{ item.menuItem.category }}</span>
            </v-ons-list-item>
          </v-ons-list>
        </v-ons-list-item>
        <v-ons-list-item>
          <ul class="supplierInfo">
            <li>
              Telefoonnummer:&nbsp;<a :href="'tel:' + supplier[0].supplier.telephone">{{ supplier[0].supplier.telephone }}</a>
            </li>
            <li>
              Website:&nbsp;<a :href="supplier[0].supplier.website">{{ supplier[0].supplier.website }}</a>
            </li>
          </ul>
        </v-ons-list-item>
      </v-ons-list>
      <!-- <v-ons-col>
        <v-ons-card>
          <div class="left">
            {{ order.updatedOn }}
          </div>
          <div class="center">
            <span v-if="order.userModel && order.userModel.username">by {{ order.userModel.username }}</span>
          </div>
        </v-ons-card>
      </v-ons-col> -->
    </div>

    <v-ons-speed-dial position="bottom right" direction="up" :visible="spdVisible" :open.sync="spdOpen">
      <v-ons-fab>
        <v-ons-icon icon="fa-plus"></v-ons-icon>
      </v-ons-fab>
    </v-ons-speed-dial>
  </v-ons-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'home',
  data () {
    return {
      pullHookState: 'initial',
      spdVisible: true,
      spdOpen: true,
      suppliers: {},
      onLine: navigator.onLine
      // orders: [],
    }
  },
  mounted: function () {
    this.listOrdersPerSupplierOnHomepage(() => {})
    window.addEventListener('online', this.updateConnectionStatus)
    window.addEventListener('offline', this.updateConnectionStatus)
  },
  methods: {
    listOrdersPerSupplierOnHomepage (done) {
      axios.get(process.env.API + '/orders/listPerSupplierOnHomepage')
        .then(response => {
          console.log('listOrdersPerSupplierOnHomepage')
          console.log(response.data)
          this.suppliers = response.data
          done()
        })
        .catch(error => {
          console.error(error)
          done()
        })
    },
    updateConnectionStatus () {
      this.onLine = navigator.onLine
    }
    // listOrders (done) {
    //   var url = process.env.API + '/orders/list?'
    //   url += 'dateTime=' + new Date().toISOString()
    //   url += '&orderBy=updatedOn'
    //   url += '&orderDirection=DESC'
    //   if (this.$cookie.get('$aariXaFood$token')) {
    //     url += '&access_token=' + this.$cookie.get('$aariXaFood$token')
    //   }
    //   axios.get(url)
    //     .then(response => {
    //       console.log('listOrders')
    //       console.log(response.data)
    //       this.orders = response.data
    //       done()
    //     })
    //     .catch(error => {
    //       console.error(error)
    //     })
    // }
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

.list-item__subtitle {
  margin-top: 5px;
}

.list-item__info {
  font-size: 14px;
}

ul.supplierInfo {
  list-style-type: none;
  padding-left: 0px;
  margin: 5px 0px 5px 0px;
}

ul.supplierInfo li {
  display: inline-block;
}

ul.supplierInfo li {
  display: inline-block;
}

ul.supplierInfo li a {
  color: #0f72b4;
}

ul.supplierInfo li:not(:last-of-type) {
  margin-right: 10px;
}

ons-list-title {
  text-transform: none;
  margin: 20px 0px 10px 0px;
  font-size: 18px;
  clear: both;
}

ons-list-title {
  text-transform: none;
  margin: 20px 0px 10px 0px;
  font-size: 18px;
  clear: both;
}

ons-pull-hook {
  margin-top: 20px;
  height: 40px!important;
  line-height: 40px!important;
}

ons-list.list--inset {
  margin: 8px;
  align-self: flex-start;
}
</style>
