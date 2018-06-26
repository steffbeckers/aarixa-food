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
      <!-- <v-layout row wrap>
        <v-flex xs12>
          <v-alert :value="true" type="info">
            Deze pagina is nog niet volledig klaar.
          </v-alert>
        </v-flex>
      </v-layout> -->
      <v-layout row wrap>
        <v-flex xs12>
          <div class="title">Keuken</div>
        </v-flex>
        <v-flex v-if="onDuty" xs12>
          <p class="mb-0"><v-icon>assignment_ind</v-icon> {{ onDuty }} staat deze week in voor de keuken.</p>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-0">
        <v-flex
          md6
          xs12
        >
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
            :items="dutyPeriodsList"
            :loading="this.$store.state.loading"
            :search="search"
            disable-initial-sort
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPageItems"
            rows-per-page-text="Items per pagina:"
            no-results-text="Geen resultaten gevonden."
            no-data-text="Er staat nog niets op de planning."
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.userModel.username }}</td>
              <td>{{ props.item.startDate | formatDate }}</td>
              <td>{{ props.item.endDate | formatDate }}</td>
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
import moment from 'moment'

export default {
  data() {
    return {
      errors: [],
      dutyPeriodsList: JSON.parse(localStorage.getItem('kitchen:dutyPeriods')) || [],
      onDuty: JSON.parse(localStorage.getItem('kitchen:onDuty')) || null,
      search: '',
      rowsPerPageItems: [5, 10, 25, 50, { text: 'Alles', value: -1 }],
      pagination: {
        sortBy: 'startDate'
      },
      headers: [
        {
          text: 'aariXiaan',
          align: 'left',
          value: 'userModel.username'
        },
        {
          text: 'Van',
          align: 'left',
          value: 'startDate'
        },
        {
          text: 'Tot',
          align: 'left',
          value: 'endDate'
        }
      ]
    }
  },
  created: function() {
    this.listDutyPeriods()
  },
  methods: {
    listDutyPeriods() {
      let filter = {
        include: {
          relation: 'userModel',
          scope: {
            fields: ['id', 'username']
          }
        },
        where: {
          endDate: {
            gte: moment().format('YYYY-MM-DD')
          }
        }
      }
      this.$axios
        .get(process.env.API + '/KitchenDuties?filter=' + JSON.stringify(filter))
        .then(response => {
          this.dutyPeriodsList = response.data
          localStorage.setItem('kitchen:dutyPeriods', JSON.stringify(this.dutyPeriodsList))

          // Check who is on duty right now
          this.onDutyRightNow()
        })
        .catch(error => {
          this.errors.unshift(error)
        })
    },
    onDutyRightNow() {
      let now = moment()
      let assigned = false

      for (let i = 0; i < this.dutyPeriodsList.length; i++) {
        const period = this.dutyPeriodsList[i]

        if (moment(period.startDate) <= now && now <= moment(period.endDate).add(1, 'day')) {
          if (period.userModel && period.userModel.username) {
            this.onDuty = period.userModel.username
            localStorage.setItem('kitchen:onDuty', JSON.stringify(this.onDuty))
            assigned = true
            continue
          }
        }
      }

      if (!assigned) {
        this.onDuty = null
      }
    }
  },
  name: 'Kitchen'
}
</script>
