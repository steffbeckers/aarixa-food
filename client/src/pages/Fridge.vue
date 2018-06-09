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
      <v-layout row wrap>
        <v-flex
          xl3
          lg4
          md6
          sm12
          v-for="item in items" :key="item.id"
        >
        {{ item.name }}
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
