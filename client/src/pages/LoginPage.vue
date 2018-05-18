<template>
  <v-ons-page>
    <v-ons-toolbar class="login-toolbar">
      <div class="center">aariXaFood</div>
    </v-ons-toolbar>
  </v-ons-page>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      email: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  text-align: center;
}

img {
  max-width: 300px;
}

ons-list-title {
  text-transform: none;
}

ons-list-title {
  margin-top: 10px;
}

ons-card {
  text-align: center;
}

ons-list-item, ons-card {
  cursor: pointer;
}
</style>
