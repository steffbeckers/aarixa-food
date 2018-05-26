<template>
  <v-container grid-list-md fluid>
    <v-layout v-show="loading" row class="mt-3 mb-3">
      <v-layout
        column
        align-center
      >
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-layout>
    </v-layout>
    <v-layout row wrap>
      <v-flex class="mt-2 ml-2" xs12>
        <div class="title">Leveranciers</div>
      </v-flex>
      <v-flex
        xl3
        lg4
        md6
        sm12
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
                  {{ timespan.from }} - {{ timespan.until }}
                </span>
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
</template>

<style scoped>
.card {
  margin: 10px;
}
.card__media,
.card__title {
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      loading: false,
      suppliers: [],
      dayOfWeek: new Date().getDay()
    }
  },
  mounted: function() {
    this.listSuppliers()
  },
  methods: {
    listSuppliers() {
      this.loading = true
      this.$axios
        .get(process.env.API + '/suppliers')
        .then(response => {
          this.loading = false
          this.suppliers = response.data
        })
        .catch(error => {
          this.loading = false
          console.error(error)
        })
    },
    navigateToSupplier(slug) {
      this.$router.push({ name: 'SupplierDetail', params: { slug: slug } })
    }
  },
  name: 'Suppliers'
}
</script>
