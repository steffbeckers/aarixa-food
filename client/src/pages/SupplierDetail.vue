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
    <v-layout v-if="!$store.state.authenticated" row wrap>
      <v-flex xs12>
        <v-alert :value="true" type="info" @click.stop="$store.commit('drawer', true)">
          Meld je aan om iets te bestellen van {{ supplier.name }}.
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
        v-if="this.$store.state.authenticated && this.order && this.order.id"
        md6
        xs12
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
              <div :key="index" :class="!item.menuItem ? 'noMenuItem' : ''">
                <v-list-tile :class="item.editInfo ? 'expandedListTile' : ''">
                <v-list-tile-action v-if="item.menuItem && item.quantity < 2" id="quantitySelector">
                  <v-btn @click="menuItemQuantity(item, 1)" icon ripple>
                    <v-icon color="grey lighten-1">add</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action v-else-if="item.menuItem" id="quantitySelector">
                  <v-spacer></v-spacer>
                  <v-btn class="mb-2" @click="menuItemQuantity(item, 1)" icon ripple>
                    <v-icon color="grey lighten-1">add</v-icon>
                  </v-btn>
                  <v-btn class="mt-2" @click="menuItemQuantity(item, -1)" icon ripple>
                    <v-icon color="grey lighten-1">remove</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-list-tile-action>
                <v-list-tile-content>
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
                  <v-list-tile-sub-title v-if="item.editInfo && item.menuItem && item.menuItem.types && item.menuItem.types.length > 0">
                    <v-radio-group class="pt-2 pb-2" v-model="item.selectedType" hide-details row>
                      <v-radio :ripple="false" color="primary" v-for="(itemType, index) in item.menuItem.types" :key="index" :label="itemType.type" :value="index"></v-radio>
                    </v-radio-group>
                  </v-list-tile-sub-title>
                  <div style="width: 100%;" v-if="item.editInfo">
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
                <v-list-tile-content v-if="item.menuItem && (item.menuItem.price > 0 || item.priceOverride > 0)" style="min-width: 65px">
                  <v-list-tile-title class="text-xs-right" v-if="item.quantity === 1">{{ (item.priceOverride || item.menuItem.price) | formatMoney }}</v-list-tile-title>                  
                  <v-list-tile-title class="text-xs-right" v-if="item.quantity > 1">{{ (item.priceOverride || item.menuItem.price) * item.quantity | formatMoney }}</v-list-tile-title>
                  <v-list-tile-title class="text-xs-right" style="color: rgba(0, 0, 0, 0.5); font-size: 14px" v-if="item.quantity > 1">
                    {{ (item.priceOverride || item.menuItem.price) | formatMoney }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-content v-if="item.menuItem && item.menuItem.types && item.menuItem.types.length > 0 && item.selectedType >= 0" style="min-width: 65px">
                  <v-list-tile-title v-if="item.quantity === 1" class="text-xs-right">{{ (item.priceOverride || item.menuItem.types[item.selectedType].price) | formatMoney }}</v-list-tile-title>                  
                  <v-list-tile-title v-if="item.quantity > 1" class="text-xs-right">{{ (item.priceOverride || item.menuItem.types[item.selectedType].price) * item.quantity | formatMoney }}</v-list-tile-title>
                  <v-list-tile-title v-if="item.quantity > 1" class="text-xs-right" style="color: rgba(0, 0, 0, 0.5); font-size: 14px">
                    {{ (item.priceOverride || item.menuItem.types[item.selectedType].price) | formatMoney }}
                  </v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action v-if="item.menuItem && !item.editInfo" @click="toggleEditItemInfoOnOrder(item); search = ''">
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-action v-else-if="item.menuItem" class="mr-2" style="min-width: 40px;">
                  <v-spacer></v-spacer>
                  <v-btn icon ripple @click="toggleEditItemInfoOnOrder(item); calculateOrderPrice()">
                    <v-icon color="grey lighten-1">done</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <!-- <v-btn class="mt-2" icon ripple @click="favoriteItem(item); search = ''"> ; search = '': Hack to trigger update UI
                    <v-icon v-if="item.favorite" color='yellow accent-3'>star</v-icon>
                    <v-icon v-else color='grey lighten-1'>star</v-icon>
                  </v-btn> -->
                </v-list-tile-action>
                <v-list-tile-action @click="removeItemFromOrder(item); calculateOrderPrice()" v-if="!item.editInfo">
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
                    <strong>{{ data.item.name || data.item }}</strong>
                    <!-- <strong>{{ data.item.name || data.item }}<span v-if="data.item.price > 0"> - {{ data.item.price | formatMoney }}</span></strong> -->
                  </v-chip>
                </template>
              </v-select>
              <v-flex v-if="item.editInfo && selected" class="text-xs-center mx-2">
                <v-btn
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
          <v-list v-if="order.price != 0" class="pa-0" cl>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title class="text-xs-center">Totaal: {{ order.price | formatMoney }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-btn
            block
            color="primary"
            class="mt-0 elevation-0"
            :disabled="order.orderItems && order.orderItems.length === 0 || editing"
            @click="placeOrder()"
          >
            Bestelling plaatsen
          </v-btn>
        </v-card>
        <!-- <div class="mt-4" v-if="$store.state.favoriteMenuItems && $store.state.favoriteMenuItems[supplier.id] && $store.state.favoriteMenuItems[supplier.id].length > 0">
          <div class="subtitle">Mijn favorieten</div>
          <v-layout row wrap>
            <v-flex>
              <v-chip v-for="item in $store.state.favoriteMenuItems[supplier.id]" :key="item.id" color="grey" text-color="white">
                <v-avatar @click="removeFavoriteItem(item)">
                  <v-icon>close</v-icon>
                </v-avatar>
                <div @click="addFavoriteToOrder(item)">
                  <span v-if="item.selectedType && item.quantity === 1">{{ item.menuItem.types[item.selectedType].name }}</span>
                  <span v-if="!item.selectedType && item.quantity === 1">{{ item.menuItem.name }}</span>
                  <span v-if="item.subItems.length > 0">{{ subItemsListing(item) }}</span>
                  <span v-if="item.info">/ {{ item.info }}</span>
                  <span v-if="item.menuItem.category">&nbsp;({{ item.menuItem.category }})</span>
                </div>
              </v-chip>
            </v-flex>
          </v-layout>
        </div> -->
        <div class="mt-4 mb-2" v-if="mostOrderedMenuItems.length > 0">
          <div class="subtitle">Meest besteld</div>
          <v-layout row wrap>
            <v-flex>
              <v-chip v-if="item && item.timesOrdered && item.timesOrdered > 0" v-for="(item, index) in mostOrderedMenuItems" :key="index" @click="addMenuItemToOrder(item)" color="grey" text-color="white">
                <v-avatar color="grey darken-1">{{ item.timesOrdered }}</v-avatar>
                {{ item.name }} ({{ item.category }})
              </v-chip>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex
        :md6="$store.state.authenticated"
        :md12="!this.$store.state.authenticated"
        xs12
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
          v-if="this.$store.state.authenticated && this.order && this.order.id"
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
              <td>
                <span v-if="props.item.price > 0">{{ props.item.price | formatMoney }}</span>
                <div v-else-if="props.item.types" v-for="itemType in props.item.types" :key="itemType.type">
                  <span class="d-inline-block" style="min-width: 40px;">{{ itemType.type }}:</span>
                  <span class="d-inline-block" style="min-width: 51px;">{{ itemType.price | formatMoney }}</span>
                </div>
              </td>
            </tr>
          </template>
          <template slot="pageText" slot-scope="{ pageStart, pageStop, itemsLength }">
            {{ pageStart }}-{{ pageStop }} van {{ itemsLength }}
          </template>
        </v-data-table>
        <v-btn
          v-if="this.$store.state.authenticated && this.order && this.order.id"
          block
          color="primary"
          :disabled="selected.length === 0"
          @click="addSelectionToOrder"
          class="elevation-0"
        >
          Selectie toevoegen aan bestelling
        </v-btn>
        <div class="subtitle mt-4">Niet op de menukaart? <span style="font-size: larger">&#x1F914;</span> Voeg hier zelf iets toe aan je bestelling.</div>
        <v-form 
          ref="customItemForm"
          v-model="customItemFormValid"
          @submit="addCustomItemToOrder"
        >
          <v-text-field 
            :rules="customItemRules"
            type="text"
            v-model="customItem"
            label="Beschrijving"
            clearable
          ></v-text-field>
          <v-btn
            :disabled="!customItemFormValid"
            block
            color="primary"
            type="submit"
            class="elevation-0"
          >
            Toevoegen aan bestelling
          </v-btn>          
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
  </transition>
</template>

<style scoped>
th.column {
  text-align: left;
}

#quantitySelector {
  min-width: 40px;
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
  background: #1976d2 !important;
  color: #ffffff;
}

#expandedListTile {
  height: 176px;
}

.list__tile__title {
  height: auto;
  max-height: 72px;
  white-space: normal;
}
</style>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      errors: [],
      editing: false,
      supplier: {},
      order: { orderItems: [] },
      customItem: null,
      customItemRules: [
        v => !!v || 'Beschrijving is vereist'
      ],
      customItemFormValid: false,
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
  computed: {
    mostOrderedMenuItems: function() {
      return _.orderBy(
        _.filter(this.supplier.menuItems, function(item) {
          if (item.timesOrdered > 0) return item
        }),
        ['timesOrdered'],
        ['desc']
      )
    }
  },
  created() {
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
        .get(process.env.API + '/Suppliers/slug/' + this.$route.params.slug)
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
      if (!this.$store.state.authenticated) {
        return
      }

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
    checkForDefaultMenuItemType(menuItem) {
      if (menuItem && menuItem.types) {
        for (let i = 0; i < menuItem.types.length; i++) {
          if (menuItem.types[i].default === true) {
            return i
          }
        }
      }
    },
    addMenuItemToOrder(item) {
      this.$axios
        .post(process.env.API + '/Orders/' + this.order.id + '/orderItems', {
          menuItemId: item.id,
          quantity: 1,
          info: ''
        })
        .then(response => {
          // Add to order items
          this.order.orderItems.push({
            menuItem: item,
            subItems: [],
            selectedType: this.checkForDefaultMenuItemType(item) || 0,
            ...response.data
          })
          // Recalculate price
          this.calculateOrderPrice()
          // Set updatedOn
          this.order.updatedOn = new Date().toISOString()
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    addSelectionToOrder() {
      // Add selected items to order as order items
      this.selected.forEach(selectedItem => {
        this.checkForDefaultMenuItemType(selectedItem)

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
              selectedType: this.checkForDefaultMenuItemType(selectedItem) || 0,
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
      // Toggle editInfo
      if (item.editInfo === undefined) {
        item.editInfo = true
      } else {
        item.editInfo = !item.editInfo
      }

      // Editing
      this.editing = item.editInfo

      // If edit mode, don't save yet
      if (item.editInfo) { return }

      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()

      // API
      this.$axios
        .patch(process.env.API + '/OrderItems/' + item.id, {
          info: item.info,
          priceOverride: item.priceOverride,
          subItems: item.subItems,
          selectedType: item.selectedType
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    favoriteItem(item) {
      let favorites = this.$store.state.favoriteMenuItems
        ? this.$store.state.favoriteMenuItems[this.supplier.id] || []
        : []

      item.favorite = !item.favorite

      if (item.favorite) {
        favorites.push(item)
      } else {
        let index = favorites.indexOf(item)
        if (index !== -1) favorites.splice(index, 1)
      }

      this.$store.commit(
        'setUserFavoriteMenuItemsBySupplier',
        { supplierId: this.supplier.id, favorites: favorites }
      )

      // API
      this.$axios
        .patch(process.env.API + '/UserModels/' + this.$store.state.user.id, {
          favoriteMenuItems: this.$store.state.favoriteMenuItems || {}
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    removeFavoriteItem(item) {
      let favorites = this.$store.state.favoriteMenuItems
        ? this.$store.state.favoriteMenuItems[this.supplier.id] || []
        : []

      let index = favorites.indexOf(item)
      if (index !== -1) favorites.splice(index, 1)

      this.$store.commit(
        'setUserFavoriteMenuItemsBySupplier',
        { supplierId: this.supplier.id, favorites: favorites }
      )

      // API
      this.$axios
        .patch(process.env.API + '/UserModels/' + this.$store.state.user.id, {
          favoriteMenuItems: this.$store.state.favoriteMenuItems || {}
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    addFavoriteToOrder(item) {
      let newOrderItem = Object.assign({}, item)

      // Update newOrderItem
      delete newOrderItem.id
      delete newOrderItem.createdOn
      delete newOrderItem.updatedOn
      delete newOrderItem.deletedOn
      newOrderItem.orderId = this.order.id
      newOrderItem.editInfo = false
      newOrderItem.quantity = 1

      this.$axios
        .post(process.env.API + '/Orders/' + this.order.id + '/orderItems', newOrderItem)
        .then(response => {
          // Add to order items
          this.order.orderItems.push({
            menuItem: newOrderItem.menuItem,
            ...response.data
          })
          // Recalculate price
          this.calculateOrderPrice()
          // Set updatedOn
          this.order.updatedOn = new Date().toISOString()
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    addSelectedSubItems(item) {
      // If subItems not exists on item, create empty array
      if (item.subItems === undefined) {
        item.subItems = []
      }
      // Merge subItems with selected items
      item.subItems = [...item.subItems, ...this.selected]
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

      // Set updatedOn
      this.order.updatedOn = new Date().toISOString()
      // Recalculate price
      this.calculateOrderPrice()
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
    removeItemFromOrder(item) {
      // Local
      let index = this.order.orderItems.indexOf(item)
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
    addCustomItemToOrder(e) {
      e.preventDefault() // Submit

      if (!this.$store.state.authenticated || !this.$refs.customItemForm.validate()) { return }

      this.$axios
        .post(process.env.API + '/Orders/' + this.order.id + '/orderItems', {
          info: this.customItem
        })
        .then(response => {
          // Add to order items
          this.order.orderItems.push({
            ...response.data
          })
          // Set updatedOn
          this.order.updatedOn = new Date().toISOString()

          // Reset custom item
          this.customItem = null

          return true
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    calculateOrderPrice() {
      this.order.price = 0
      this.order.orderItems.forEach(item => {
        if (item.priceOverride) {
          this.order.price += item.priceOverride * item.quantity
        } else if (item.menuItem && item.menuItem.types && item.menuItem.types.length > 0 && item.selectedType >= 0) {
          this.order.price += item.menuItem.types[item.selectedType].price * item.quantity
        } else if (item.menuItem && item.menuItem.price) {
          this.order.price += item.menuItem.price * item.quantity
        }
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

      // If no slug provided, navigate to supplier overview
      if (!to.params.slug) {
        this.$router.push({ name: 'Suppliers' })
      }

      this.getSupplier()
      this.getOrder()
    }
  },
  name: 'SupplierDetail'
}
</script>
