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
          <div class="title">Koelkast</div>
        </v-flex>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-flex
          lg2
          md3
          sm4
          xs6
          v-for="item in items" :key="item.id"
        >
        <img class="d-block mx-auto" :src="'static/img/fridge/' + item.image" :alt="item.name">
        <p class="mt-2 text-xs-center">{{ item.name }}</p>
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
export default {
  data() {
    return {
      errors: [],
      items: []
    }
  },
  created: function() {
    this.listItems()
  },
  methods: {
    listItems() {
      this.$axios
        .get(process.env.API + '/fridgeItems')
        .then(response => {
          this.items = response.data
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    }
  },
  name: 'Fridge'
}
</script>
