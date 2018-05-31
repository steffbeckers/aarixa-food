<template>
  <transition name="bounce">
  <v-container grid-list-lg fluid>
    <v-layout row>
      <v-flex>
        <div class="title">aariXianen</div>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex>
        
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex>
      </v-flex>
    </v-layout>
  </v-container>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      userModels: [],
      userModel: {}
    }
  },
  created: function() {
    this.getUserModels()
  },
  methods: {
    getUserModels() {
      this.$store.commit('loader', true)
      this.$axios
        .get(process.env.API + '/usermodels')
        .then(response => {
          this.$store.commit('loader', false)
          this.userModels = response.data
        })
        .catch(error => {
          this.$store.commit('loader', false)
          console.error(error)
        })
    }
  },
  name: 'AdminUserModels'
}
</script>
