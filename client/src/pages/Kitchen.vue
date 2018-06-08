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
          <div class="title">Keuken</div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          xl3
          lg4
          md6
          sm12
        >
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
      suppliers: [],
      dayOfWeek: new Date().getDay()
    }
  },
  created: function() {
    this.listSuppliers()
  },
  methods: {
    listSuppliers() {
      this.$axios
        .get(process.env.API + '/suppliers')
        .then(response => {
          this.suppliers = response.data
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
  name: 'Kitchen'
}
</script>
