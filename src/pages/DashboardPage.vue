<template>
  <div class="d-flex flex-grow-1 flex-column">
    <draggable class="row flex-grow-0 row--dense">
      <v-col cols="12" md="6" xl="6">
        <academy class="h-full" />
      </v-col>
      <v-col cols="12" md="6" xl="3">
        <document-list-card class="h-full" />
      </v-col>
      <v-col cols="12" md="6" xl="3">
        <booking-list-card class="h-full" />
      </v-col>
      <v-col cols="12" md="6" xl="3">
        <incoming-payment-list-card class="h-full" />
      </v-col>
      <v-col cols="12" md="6" xl="3">
        <outgoing-payment-list-card class="h-full" />
      </v-col>
    </draggable>
  </div>
</template>

<script>
import Academy from '@/components/dashboard/Academy'
import DocumentListCard from '@/components/dashboard/DocumentListCard'
import BookingListCard from '@/components/dashboard/BookingListCard'
import IncomingPaymentListCard from '@/components/dashboard/IncomingPaymentListCard'
import OutgoingPaymentListCard from '@/components/dashboard/OutgoingPaymentListCard'
import draggable from 'vuedraggable'

export default {
  components: {
    OutgoingPaymentListCard,
    IncomingPaymentListCard,
    BookingListCard,
    DocumentListCard,
    draggable,
    Academy
  },
  title: 'Рабочий стол',
  data() {
    return {
    }
  }
}
</script>
