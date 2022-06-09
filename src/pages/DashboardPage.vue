<template>
  <v-container>
    <page-header h1="Портал Медэк" :show-home-link="false" />
    <div class="d-flex flex-grow-1 flex-column">
      <v-row class="flex-grow-0" dense>
        <v-col cols="12" md="6" xl="5">
          <academy class="h-full" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import Academy from '@/components/dashboard/Academy'

export default {
  components: {
    PageHeader,
    Academy
  },
  data() {
    return {
    }
  }
}
</script>
