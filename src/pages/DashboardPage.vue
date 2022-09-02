<template>
  <div class="d-flex flex-grow-1 flex-column">
    <draggable class="row flex-grow-0 row--dense">
      <v-col cols="12" md="6" xl="6">
        <academy-widget class="h-full" />
      </v-col>
      <!--      <v-col cols="12" md="6" xl="3">-->
      <!--        <document-list-card class="h-full" />-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="6" xl="3">-->
      <!--        <booking-list-card class="h-full" />-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="6" xl="3">-->
      <!--        <incoming-payment-list-card class="h-full" />-->
      <!--      </v-col>-->
      <!--      <v-col cols="12" md="6" xl="3">-->
      <!--        <outgoing-payment-list-card class="h-full" />-->
      <!--      </v-col>-->
    </draggable>
  </div>
</template>

<script>
import AcademyWidget from '@/components/dashboard/AcademyWidget'
import draggable from 'vuedraggable'
import HasTitle from '@/mixins/hasTitle'

export default {
  components: {
    draggable,
    AcademyWidget
  },
  mixins: [HasTitle],
  title: 'Рабочий стол',
  data() {
    return {
    }
  }
}
</script>
