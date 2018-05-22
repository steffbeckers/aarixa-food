<template>
  <v-container fluid>
    <v-layout
      row
      class="mb-3"
    >
      <v-layout column>
        <div class="title">{{ supplier.name }}</div>
      </v-layout>
    </v-layout>
    <v-layout v-show="loading || loadingOrder" row class="mb-3">
      <v-layout
        column
        align-center
      >
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-layout>
    </v-layout>
    <v-layout row wrap class="mb-3">
      <v-flex
        xl4
        lg6
        md6
        sm12
        class="mb-5"
      >
        <div class="subtitle">Menukaart</div>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          class="mb-2"
        ></v-text-field>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="supplier.menuItems"
          :search="search"
          :pagination.sync="pagination"
          select-all
          item-key="name"
          class="elevation-1 mb-3"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th>
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  primary
                  hide-details
                  @click.native="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                {{ header.text }}
                <v-icon small>arrow_upward</v-icon>                
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.category }}</td>
              <td>{{ props.item.price | formatMoney }}</td>
            </tr>
          </template>
        </v-data-table>
        <v-btn
          block
          color="primary"
          :disabled="this.selected.length === 0"
          @click="addSelectionToOrder"
        >
          Selectie toevoegen aan bestelling
        </v-btn>
      </v-flex>
      <v-flex
        xl4
        lg6
        md6
        sm12
        class="mb-5"
      >
        <v-card class="ml-5 mr-5">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>
              Mijn bestelling
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <span class="toolbar__title">{{ order.updatedOn | formatTime }}</span>
          </v-toolbar>
          <v-list v-show="order.orderItems.length === 0">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Waar heb je zin in? &#x1F60B; Voeg items van de menukaart toe.</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list v-show="order.orderItems.length > 0" two-line>
            <template v-for="(item, index) in order.orderItems">
              <v-list-tile
                :key="item.id"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.menuItem.name }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">{{ item.menuItem.category }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ item.info }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < order.orderItems.length" :key="index"></v-divider>
            </template>
          </v-list>
          <v-btn
            block
            color="primary"
            class="mt-2"
            :disabled="order.orderItems.length === 0"
          >
            Bestelling plaatsen
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style scoped>
  th.column {
    text-align: left;
  }
</style>

<script>
export default {
  data () {
    return {
      loading: false,
      supplier: {},
      loadingOrder: false,
      order: { orderItems: [] },
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      search: '',
      headers: [
        {
          text: 'Naam',
          align: 'left',
          value: 'name'
        },
        {
          text: 'Categorie',
          align: 'left',
          value: 'category'
        },
        {
          text: 'Prijs',
          align: 'left',
          value: 'price'
        }
      ],
      now: new Date().toISOString()
    }
  },
  created: function () {
    setInterval(function () { this.now = new Date().toISOString() }, 1000 * 60)
  },
  mounted: function () {
    this.getSupplier()
    this.getOrder()
  },
  methods: {
    getSupplier () {
      this.loading = true
      this.$axios.get(process.env.API + '/suppliers/slug/' + this.$route.params.slug)
        .then(response => {
          this.loading = false
          this.supplier = response.data
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.supplier.menuItems.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    getOrder () {
      this.loadingOrder = true
      this.$axios.get(
        process.env.API +
        '/UserModels/' +
        this.$store.state.user.id +
        '/getOrCreateOrderForSupplier/' +
        this.$route.params.slug
      )
        .then(response => {
          this.loadingOrder = false
          this.order = response.data
        })
        .catch(error => {
          this.loadingOrder = false
          console.error(error)
        })
    },
    addSelectionToOrder () {
      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()
      // Add selected items to order as order items
      this.selected.forEach(selectedItem => {
        this.order.orderItems.push({
          menuItemId: selectedItem.id,
          menuItem: selectedItem,
          quantity: 1,
          info: ''
        })
      })
      // Reset selection
      this.selected = []
    }
  },
  watch: {
    '$route' (to, from) {
      this.getSupplier()
    }
  },
  name: 'SupplierDetail'
}
</script>
