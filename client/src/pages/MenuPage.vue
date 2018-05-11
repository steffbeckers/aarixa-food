<template>
  <v-ons-page>
    <v-ons-toolbar modifier="transparent"></v-ons-toolbar>
    <div class="header">
      <img src="../assets/aariXa_Shield_1x1.png" alt="aariXa Schild">
    </div>
    <v-ons-list>
      <v-ons-list-item modifier="chevron">
        <div class="left"><v-ons-icon fixed-width :icon="'fa-list-ul'"></v-ons-icon></div>
        <div class="center">Bestellingen</div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  name: 'navigation-menu'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  text-align: center;
  margin-bottom: 44px;
}

img {
  max-width: 150px;
}

ons-list-title {
  text-transform: none;
}

ons-list-item {
  cursor: pointer;
}
</style>
