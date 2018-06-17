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
        <div class="title">aariXianen</div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-btn class="ml-0" color="primary" @click="createDialog = true" dark>Toevoegen</v-btn>                
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-dialog v-model="createDialog" max-width="300px">
          <v-card>
            <v-card-title>Gebruiker toevoegen</v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="newUserModel.email" label="E-mail"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click.stop="createDialogClose()">Sluiten</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click.stop="createUserModel()">Toevoegen</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Zoeken"
          single-line
          hide-details
          clearable
          class="mb-2 pt-0 menuSearch"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="userModels"
          hide-actions
          :loading="this.$store.state.loading"
          :search="search"          
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-edit-dialog
                :return-value.sync="props.item.username"
                lazy
              >
                {{ props.item.username }}
                <v-text-field
                  slot="input"
                  v-model="props.item.username"
                  label="Gebruikersnaam"
                  single-line
                  @change="updateUsernameOfUserModel(props.item)"
                ></v-text-field>
              </v-edit-dialog>
            </td>
            <td>{{ props.item.email }}</td>
            <td>
              <v-btn v-if="$store.state.authenticated && props.item.id !== $store.state.user.id" icon class="mx-0" @click="deleteUserModel(props.item)">
                <v-icon color="grey">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="pageText" slot-scope="{ pageStart, pageStop, itemsLength }">
            {{ pageStart }}-{{ pageStop }} van {{ itemsLength }}
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      errors: [],
      userModels: [],
      defaultUserModel: {
        email: '@aariXa.be'
      },
      createDialog: false,
      newUserModel: {},
      search: '',
      headers: [
        {
          text: 'Gebruikersnaam',
          align: 'left',
          value: 'username'
        },
        {
          text: 'E-mail',
          align: 'left',
          value: 'email'
        },
        { text: 'Acties', value: 'email', sortable: false }
      ]
    }
  },
  created: function() {
    // Set new user with defaults
    this.newUserModel = Object.assign({}, this.defaultUserModel)
    // Retrieve all users
    this.getUserModels()
  },
  methods: {
    getUserModels() {
      this.$axios
        .get(process.env.API + '/UserModels')
        .then(response => {
          this.userModels = response.data
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    createDialogClose() {
      this.createDialog = false
      // Set new user with defaults
      this.newUserModel = Object.assign({}, this.defaultUserModel)
    },
    createUserModel() {
      this.$axios
        .post(process.env.API + '/UserModels', this.newUserModel)
        .then(response => {
          // Add new user to list
          this.userModels.push(response.data)
          this.createDialogClose()
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    updateUsernameOfUserModel(userModel) {
      this.$axios
        .patch(process.env.API + '/UserModels/' + userModel.id, { username: userModel.username })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    deleteUserModel(userModel) {
      if (!confirm('Ben je zeker dat je ' + userModel.username + ' wilt verwijderen?')) { return }
      this.$axios
        .delete(process.env.API + '/UserModels/' + userModel.id)
        .then(response => {
          // Remove from listing
          let userModelIndex = this.userModels.findIndex(user => {
            return user.id === userModel.id
          })
          this.userModels.splice(userModelIndex, 1)
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    }
  },
  name: 'AdminUserModels'
}
</script>
