<template>
  <v-timeline class="pa-0" dense align-top>
    <v-timeline-item v-for="(item, index) in activity" :key="index" :color="item.color" small>
      <strong>{{ item.what }}</strong>
      <div class="caption">
        <div>{{ item.description }}</div>
        <div class="grey--text d-flex">
          <v-icon size="small" color="grey" class="mr-1">mdi-clock-outline</v-icon>
          {{ item.when }}
        </div>
      </div>
      <div v-if="item.button">
        <v-btn :disabled="item.button.hasOwnProperty('disabled') || item.button.disabled" class="mt-1" href="#" x-small>{{ item.button.text }}</v-btn>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  data() {
    return {
      activity: [{
        what: 'Ознакомление с Уставом',
        description: 'Необходимо ознакомиться с Уставом',
        when: '1 час',
        color: 'success',
        button: {
          text: 'Перейти к материалу'
        }
      }, {
        what: 'Регламент отдела прдаж',
        description: 'Ознакомление с регламентом отдела продаж и сдача экзамена',
        when: '2 дня',
        color: 'success',
        button: {
          text: 'Перейти к материалу'
        }
      }, {
        what: 'Регламент пост-продажного процесса',
        description: 'Ознакомление с регламентом пост-продажного процесса и сдача экзамена',
        when: '5 дней',
        color: 'warning',
        button: {
          text: 'Перейти к материалу'
        }
      }, {
        what: 'Работа с CRM',
        description: '',
        when: '3 часа',
        color: 'grey',
        button: {
          text: 'Перейти к материалу',
          disabled: true
        }
      }]
    }
  }
}
</script>
