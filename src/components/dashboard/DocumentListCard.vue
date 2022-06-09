<template>
  <v-card>
    <v-card-title class="pt-5">
      <div style="position: absolute; left: 0; top: 10px; color: #fff; padding: 0 8px; height: 24px; line-height: 24px; font-size: 1rem;" class="orange darken-3">
        документы
      </div>
      <div>Документы на модерации (4)</div>
    </v-card-title>
    <v-list two-line subheader>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        @click=""
      >
        <v-list-item-avatar>
          <v-icon
            :class="[item.iconClass]"
            v-text="item.icon"
          ></v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-card>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      items: [
        { icon: 'mdi-file-document', iconClass: 'grey lighten-1 white--text', title: 'Договор поставки № 29939/1 от 10.12.2022', subtitle: 'Артем Карамышев' },
        { icon: 'mdi-file-document', iconClass: 'grey lighten-1 white--text', title: 'Договор поставки № 29939/1 от 10.12.2022', subtitle: 'Артем Тарасов' },
        { icon: 'mdi-file-document', iconClass: 'grey lighten-1 white--text', title: 'Договор поставки № 29939/1 от 10.12.2022', subtitle: 'Артем Тарасов' },
        { icon: 'mdi-file-document', iconClass: 'grey lighten-1 white--text', title: 'Договор поставки № 29939/1 от 10.12.2022', subtitle: 'Артем Карамышев' }
      ],
      items2: [
        { icon: 'assignment', iconClass: 'blue white--text', title: 'Vacation itinerary', subtitle: 'Jan 20, 2014' },
        { icon: 'call_to_action', iconClass: 'amber white--text', title: 'Kitchen remodel', subtitle: 'Jan 10, 2014' }
      ]
    }
  },
  methods: {
    open(item) { }
  }
}
</script>
