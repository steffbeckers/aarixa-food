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
        <div class="title">{{ supplier.name }}</div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        v-if="this.$store.state.authenticated && this.order.id"
        md6
        sm12
      >
        <v-card class="elevation-0">
          <v-toolbar color="primary" class="elevation-0" dark>
            <v-toolbar-title>
              Mijn bestelling
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <span class="toolbar__title">{{ order.updatedOn | formatTime }}</span>
          </v-toolbar>
          <v-list v-show="order.orderItems.length === 0">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Waar heb je zin in? &#x1F60B;</v-list-tile-title>
                <v-list-tile-sub-title>Voeg items van de menukaart toe.</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list v-show="order.orderItems.length > 0" three-line>
            <template v-for="(item, index) in order.orderItems">
              <div :key="index">
                <v-list-tile :class="item.editInfo ? 'expandedListTile' : ''">
                <v-list-tile-action v-if="item.quantity < 2" id="quantitySelector">
                  <v-btn @click="menuItemQuantity(item, 1)" icon ripple>
                    <v-icon color="grey lighten-1">add</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action v-else id="quantitySelector">
                  <v-btn @click="menuItemQuantity(item, 1)" icon ripple>
                    <v-icon color="grey lighten-1">add</v-icon>
                  </v-btn>
                  <v-btn @click="menuItemQuantity(item, -1)" icon ripple>
                    <v-icon color="grey lighten-1">remove</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    <span v-if="item.quantity > 1">{{ item.quantity }} </span>
                    <span v-if="item.quantity > 1 && item.menuItem.namePlural">{{ item.menuItem.namePlural }}</span>
                    <span v-else>{{ item.menuItem.name }}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary" v-if="item.info && !item.editInfo">{{ item.info }}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{ item.menuItem.category }}</v-list-tile-sub-title>
                  <div v-if="item.editInfo">
                    <v-text-field
                      :rules="[(v) => v.length <= 50 || 'Max 50 characters']"
                      :counter="50"
                      v-model="item.info"
                      clearable
                      label="Extra info"
                    ></v-text-field>
                    <v-text-field
                      v-if="item.editInfo"
                      v-model.number="item.priceOverride"
                      label="Prijs"
                      type="number"
                      step="0.1"
                      min="0"
                      clearable
                      @change="calculateOrderPrice()"
                    ></v-text-field>
                  </div>
                </v-list-tile-content>
                <v-list-tile-content style="min-width: 65px">
                  <v-list-tile-title class="text-xs-right" v-if="item.quantity === 1">{{ (item.priceOverride || item.menuItem.price) | formatMoney }}</v-list-tile-title>                  
                  <v-list-tile-title class="text-xs-right" v-if="item.quantity > 1">{{ (item.priceOverride || item.menuItem.price) * item.quantity | formatMoney }}</v-list-tile-title>
                  <v-list-tile-title class="text-xs-right" style="color: rgba(0, 0, 0, 0.5); font-size: 14px" v-if="item.quantity > 1">
                    {{ (item.priceOverride || item.menuItem.price) | formatMoney }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action v-if="!item.editInfo" @click="toggleEditItemInfoOnOrder(item); search = ''; selectedCategory = 'Sauzen'">
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action v-else @click="toggleEditItemInfoOnOrder(item); calculateOrderPrice(); selectedCategory = ''" class="mr-2">
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">done</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action @click="removeItemFromOrder(item); calculateOrderPrice(); selectedCategory = ''" v-if="!item.editInfo">
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-select
                v-model="item.subItems"
                v-if="item.editInfo"
                :label="'Toevoegen aan ' + (item.quantity > 1 ? item.menuItem.namePlural : item.menuItem.name)"
                chips
                tags
                flat
                solo
                append-icon=""
                clearable
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    close
                    @input="removeSubItem(item, data.item)"
                  >
                    <strong>{{ data.item.name || data.item }}<span v-if="data.item.price > 0"> - {{ data.item.price | formatMoney }}</span></strong>
                  </v-chip>
                </template>
              </v-select>
              <v-flex class="text-xs-center mx-2">
                <v-btn
                  v-if="item.editInfo && selected"
                  color="primary"
                  :disabled="selected.length === 0"
                  @click="addSelectedSubItems(item)"
                  block
                  class="elevation-0"
                >
                  Selectie toevoegen
                </v-btn>
              </v-flex>
              <v-divider class="mt-2 mb-2" v-if="index + 1 < order.orderItems.length"></v-divider>
              </div>
            </template>
          </v-list>
          <v-list class="pa-0" cl>
            <v-list-tile v-if="order.price != 0">
              <v-list-tile-content>
                <v-list-tile-title class="text-xs-center">Totaal: {{ order.price | formatMoney }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-btn
            block
            color="primary"
            class="mt-0 elevation-0"
            :disabled="order.orderItems.length === 0 || editing"
            @click="placeOrder()"
          >
            Bestelling plaatsen
          </v-btn>
        </v-card>
      </v-flex>
      <v-flex
        v-bind:md6="$store.state.authenticated"
        v-bind:md12="!this.$store.state.authenticated"
        sm12
      >
        <div class="subtitle">Menukaart</div>
        <v-layout row wrap>
          <v-flex>
            <v-expansion-panel class="elevation-0">
              <v-expansion-panel-content>
                <div slot="header">Categorieën</div>
                <v-chip 
                  v-for="(category, categoryIndex) in supplier.menuCategories"
                  v-bind:key="categoryIndex"
                  @click="search = '';
                      selectedCategory != category ? 
                      selectedCategory = category : 
                      selectedCategory = ''"
                  v-bind:outline="selectedCategory != category"
                  label
                >
                  {{ category }}
                </v-chip>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        <v-text-field
          @click="selectedCategory = ''"
          v-model="search"
          append-icon="search"
          label="Zoeken"
          single-line
          hide-details
          clearable
          class="mb-2 pt-0 menuSearch"
        ></v-text-field>
        <v-btn
          v-if="this.$store.state.authenticated && this.order.id"
          block
          color="primary"
          :disabled="selected.length === 0"
          @click="addSelectionToOrder"
          class="elevation-0"
        >
          Selectie toevoegen aan bestelling
        </v-btn>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="supplier.menuItems"
          :search="search || selectedCategory"
          :pagination.sync="pagination"
          item-key="name"
          class="mb-2"
          :loading="this.$store.state.loading"
          :rows-per-page-items="rowsPerPageItems"
          rows-per-page-text="Items per pagina:"
          no-results-text="Geen items gevonden in menukaart."
          no-data-text="Er zijn nog geen items toegevoegd aan de menukaart."
        >
          <template slot="headers" slot-scope="props">
            <tr>
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
            <tr :active="props.selected" @click="$store.state.authenticated ? props.selected = !props.selected : false">
              <td>{{ props.item.name }}<span v-if="props.item.name === 'Mezzomix'"> &#10084;</span></td>
              <td>{{ props.item.category }}</td>
              <td>{{ props.item.price | formatMoney }}</td>
            </tr>
          </template>
          <template slot="pageText" slot-scope="{ pageStart, pageStop, itemsLength }">
            {{ pageStart }}-{{ pageStop }} van {{ itemsLength }}
          </template>
        </v-data-table>
        <v-btn
          v-if="this.$store.state.authenticated && this.order.id"
          block
          color="primary"
          :disabled="selected.length === 0"
          @click="addSelectionToOrder"
          class="elevation-0"
        >
          Selectie toevoegen aan bestelling
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
  </transition>
</template>

<style scoped>
th.column {
  text-align: left;
}

#quantitySelector.list__tile__action--stack {
  align-items: flex-start;
}

table.datatable > tbody > tr {
  cursor: pointer;
}

/* Overridden on index.html to fix datatable selection fix */
.application .theme--light.table tbody tr[active], 
.theme--light .table tbody tr[active] {
  background: #1976d2!important;
  color: #ffffff;
}

#expandedListTile {
  height: 176px;
}
</style>

<script>
export default {
  data() {
    return {
      errors: [],
      editing: false,
      supplier: {},
      order: { orderItems: [] },
      rowsPerPageItems: [5, 10, 25, 50, { text: 'Alles', value: -1 }],
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      search: '',
      selectedCategory: '',
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
      ]
    }
  },
  created: function() {
    // If no slug provided, navigate to supplier overview
    if (!this.$route.params.slug) {
      this.$router.push({ name: 'Suppliers' })
    }

    this.getSupplier()
    this.getOrder()
  },
  methods: {
    getSupplier() {
      this.$axios
        .get(process.env.API + '/suppliers/slug/' + this.$route.params.slug)
        .then(response => {
          this.supplier = response.data
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    toggleAll() {
      if (this.selected.length) this.selected = []
      else this.selected = this.supplier.menuItems.slice()
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    getOrder() {
      // Only if authenticated
      if (!this.$store.state.authenticated) { return }

      this.$axios
        .get(
          process.env.API +
            '/UserModels/' +
            this.$store.state.user.id +
            '/getOrCreateOrderForSupplier/' +
            this.$route.params.slug
        )
        .then(response => {
          this.order = response.data
          // Recalculate price
          this.calculateOrderPrice()
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    addSelectionToOrder() {
      // Add selected items to order as order items
      this.selected.forEach(selectedItem => {
        this.$axios
          .post(process.env.API + '/Orders/' + this.order.id + '/orderItems', {
            menuItemId: selectedItem.id,
            quantity: 1,
            info: ''
          })
          .then(response => {
            // Add to order items
            this.order.orderItems.push({
              menuItem: selectedItem,
              subItems: [],
              ...response.data
            })
            // Reset selection
            this.selected = []
            // Recalculate price
            this.calculateOrderPrice()
            // Set updatedOn
            this.order.updatedOn = new Date().toISOString()
          })
          .catch(error => {
            this.errors.unshift(error)
          })
      })
    },
    menuItemQuantity(item, quantity) {
      // Local
      item.quantity += quantity
      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()
      // Recalculate price
      this.calculateOrderPrice()

      // API
      this.$axios
        .patch(process.env.API + '/OrderItems/' + item.id, {
          quantity: item.quantity
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    toggleEditItemInfoOnOrder(item) {
      if (item.editInfo === undefined) {
        item.editInfo = true
      } else {
        item.editInfo = !item.editInfo
      }
      // Editing
      this.editing = item.editInfo

      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()

      // API
      this.$axios
        .patch(process.env.API + '/OrderItems/' + item.id, {
          info: item.info,
          priceOverride: item.priceOverride,
          subItems: item.subItems
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    addSelectedSubItems(item) {
      // If subItems not exists on item, create empty array
      if (item.subItems === undefined) { item.subItems = [] }
      // Merge subItems with selected items
      item.subItems = [...this.selected, ...item.subItems]
      // Reset selection
      this.selected = []

      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()
      // Recalculate price
      this.calculateOrderPrice()
    },
    removeSubItem(item, subItem) {
      // Remove from sub items
      item.subItems.splice(item.subItems.indexOf(subItem), 1)
      // Trigger changes
      item.subItems = [...item.subItems]
    },
    removeItemFromOrder(item) {
      // Local
      var index = this.order.orderItems.indexOf(item)
      if (index !== -1) this.order.orderItems.splice(index, 1)
      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()
      // Recalculate price
      this.calculateOrderPrice()

      // API
      this.$axios
        .delete(process.env.API + '/OrderItems/' + item.id)
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    calculateOrderPrice() {
      this.order.price = 0
      this.order.orderItems.forEach(item => {
        this.order.price += (item.priceOverride || item.menuItem.price) * item.quantity
      })
    },
    placeOrder() {
      // Recalculate price
      this.calculateOrderPrice()

      // API
      this.$axios
        .patch(process.env.API + '/Orders/' + this.order.id, {
          price: this.order.price,
          state: 'ready',
          updatedOn: new Date().toISOString()
        })
        .then(response => {
          // Navigate to order overview
          this.$router.push({ name: 'Root' })
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    }
  },
  watch: {
    $route(to, from) {
      // Reset
      this.errors = []
      this.editing = false

      // Retrieve
      this.getSupplier()
      this.getOrder()
    }
  },
  name: 'SupplierDetail'
}
</script>
