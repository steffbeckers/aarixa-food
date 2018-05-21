<template>
  <v-container fluid>
    <v-layout column>
      <div class="title">{{ supplier.name }}</div>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      supplier: {}
    }
  },
  mounted: function () {
    this.getSupplier()
  },
  methods: {
    getSupplier () {
      this.loading = true
      axios.get(process.env.API + '/suppliers/slug/' + this.$route.params.slug)
        .then(response => {
          this.loading = false

          this.supplier = response.data
          console.log(this.supplier)
        })
        .catch(error => {
          this.loading = false

          console.error(error)
        })
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
