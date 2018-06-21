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
          <div class="title">Leveranciers</div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          xl3
          lg4
          sm6
          xs12
          v-for="supplier in suppliers" :key="supplier.id"
        >
          <v-card>
            <v-card-media @click="navigateToSupplier(supplier.slug)" v-if="supplier.slug" :src="'/static/img/suppliers/' + supplier.slug + '/1_min.jpg'" height="150px">
            </v-card-media>
            <v-card-title @click="navigateToSupplier(supplier.slug)" primary-title>
              <div>
                <h3 class="headline mb-1">{{ supplier.name }}</h3>
                <div>
                  <span v-if="supplier.telephone" class="telephone">{{ supplier.telephone }}</span>
                  <span v-if="supplier.telephone && supplier.website"> - </span>
                  <span v-if="supplier.website" class="website">{{ supplier.website | formatWebsite }}</span>
                </div>
                <div v-if="supplier.openingHours && supplier.openingHours[dayOfWeek]">
                  <span v-for="(timespan, i) in supplier.openingHours[dayOfWeek]" v-bind:key="i">
                    <span v-if="i > 0">& </span>{{ timespan.from }} - {{ timespan.until }}
                  </span>
                  <!-- <span class="ml-1" style="color: green" v-if="supplier.openingHours && supplier.openingHours[dayOfWeek] && supplierOpen(supplier.openingHours[dayOfWeek])">
                    Open
                  </span>
                  <span class="ml-1" style="color: red" v-else>
                    Gesloten
                  </span> -->
                </div>
              </div>
            </v-card-title>
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
  </transition>
</template>

<style scoped>
.card__media,
.card__title {
  cursor: pointer;
}
</style>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      errors: [],
      suppliers: JSON.parse(localStorage.getItem('suppliers')) || [],
      dayOfWeek: new Date().getDay()
    }
  },
  created: function() {
    this.listSuppliers()
  },
  methods: {
    listSuppliers() {
      this.$axios
        .get(process.env.API + '/Suppliers')
        .then(response => {
          this.suppliers = response.data
          localStorage.setItem('suppliers', JSON.stringify(this.suppliers))
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    navigateToSupplier(slug) {
      this.$router.push({ name: 'SupplierDetail', params: { slug: slug } })
    },
    supplierOpen(timespans) {
      var isOpen = false
      var now = moment()

      timespans.forEach(timespan => {
        var fromDate = moment(timespan.from, 'HH:mm')
        var untilDate = moment(timespan.until, 'HH:mm')

        if (now.isBetween(fromDate, untilDate)) {
          isOpen = true
        }
      })

      return isOpen
    }
  },
  name: 'Suppliers'
}
</script>
