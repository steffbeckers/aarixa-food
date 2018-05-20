<template>
  <v-container fluid>
    <v-layout column>
      <div class="title">Leverancier</div>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        supplier: {}
      }
    },
    watch: {
      '$route' (to, from) {
        console.log(to, from)
      }
    },
    name: 'SupplierDetail'
  }
</script>
