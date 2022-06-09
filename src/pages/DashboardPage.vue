<template>
  <v-container>
    <page-header h1="Medeq.Academy" :show-home-link="false" />
    <div class="d-flex flex-grow-1 flex-column">
      <v-row class="flex-grow-0" dense>
        <v-col cols="12" md="6" xl="4">
          <training-plan class="h-full" />
        </v-col>
        <v-col cols="12" xl="5">
          <table-card class="h-full" label="Экзамены" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import TableCard from '@/components/dashboard/TableCard'
import TrainingPlan from '@/components/dashboard/TrainingPlan'
import PageHeader from '@/components/PageHeader'

export default {
  components: {
    PageHeader,
    TrainingPlan,
    TableCard
  },
  data() {
    return {
    }
  }
}
</script>
