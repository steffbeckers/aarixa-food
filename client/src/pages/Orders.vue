<template>
  <v-container grid-list-md fluid>
    <v-layout row>
      <v-flex class="ml-2">
        <div class="title">Bestellingen</div>
      </v-flex>
    </v-layout>
    <v-layout v-show="loading" row class="mb-3">
      <v-layout
        column
        align-center
      >
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-layout>
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

      // let today = moment()
      let filter = {
        include: {
          relation: 'orders',
          scope: {
            include: [{
              relation: 'orderItems',
              scope: {
                include: 'menuItem'
              }
            }, 'userModel'],
            where: {
              // updatedOn: {
              //   between: [
              //     new Date(today.toDate()),
              //     new Date(today.add(1, 'day').toDate())
              //   ]
              // },
              state: 'ready'
            }
          }
        }
      }
      this.$axios.get(process.env.API + '/suppliers?filter=' + encodeURIComponent(JSON.stringify(filter)))
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
