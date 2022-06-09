<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-default-footer
  >
    <template v-slot:item.id="{ item }">
      <div class="font-weight-bold"># <copy-label :text="item.id" /></div>
    </template>

    <template v-slot:item.created_at="{ item }">
      <div>{{ item.created_at | formatDate }}</div>
    </template>

    <template v-slot:item.action="{ item }">
      <v-btn v-if="item.status.color === 'red'" href="/wiki/exam" small>
        Пересдать
      </v-btn>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="item.status.color" dark>{{ item.status.text }}</v-chip>

      <v-menu
        v-if="item.auditor"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            class="ml-1"
            v-on="on"
          >
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Проверяющий</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <img :src="item.auditor.avatar" alt="">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.auditor.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                Дата проверки: {{ item.checked_at | formatDate }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="item.comment">
              <v-list-item-content>
                Комментарий: {{ item.comment }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

    </template>
  </v-data-table>
</template>

<script>
import CopyLabel from '../common/CopyLabel'

export default {
  components: {
    CopyLabel
  },
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headers: [
        { text: 'Экзамен', value: 'exam.name' },
        { text: 'Дата сдачи', value: 'created_at' },
        { text: 'Статус', value: 'status', align: 'left' },
        { text: '', value: 'action', sortable: false }
      ],
      items: [
        {
          exam: {
            name: 'Регламент отдела продаж',
            link: 'sales-order'
          },
          auditor: {
            name: 'Елена Коробкова',
            email: 'e.korobkova@medeq.ru',
            avatar: '/images/avatars/avatar3.svg'
          },
          checked_at: '2022-06-01',
          created_at: '2022-05-01',
          status: {
            text: 'Сдан',
            color: 'success'
          }
        },
        {
          exam: {
            name: 'Регламент отдела продаж',
            link: 'sales-order'
          },
          auditor: {
            name: 'Елена Коробкова',
            email: 'e.korobkova@medeq.ru',
            avatar: '/images/avatars/avatar3.svg'
          },
          checked_at: '2022-06-01',
          created_at: '2022-05-01',
          status: {
            text: 'Сдан',
            color: 'success'
          }
        },
        {
          exam: {
            name: 'Регламент отдела продаж',
            link: 'sales-order'
          },
          created_at: '2022-05-01',
          status: {
            text: 'На проверке',
            color: 'orange'
          }
        },
        {
          exam: {
            name: 'Регламент отдела продаж',
            link: 'sales-order'
          },
          auditor: {
            name: 'Елена Коробкова',
            email: 'e.korobkova@medeq.ru',
            avatar: '/images/avatars/avatar3.svg'
          },
          checked_at: '2022-06-01',
          created_at: '2022-05-01',
          status: {
            text: 'Сдан',
            color: 'success'
          }
        },
        {
          exam: {
            name: 'Регламент отдела продаж',
            link: 'sales-order'
          },
          auditor: {
            name: 'Елена Коробкова',
            email: 'e.korobkova@medeq.ru',
            avatar: '/images/avatars/avatar3.svg'
          },
          checked_at: '2022-06-01',
          created_at: '2022-05-01',
          comment: 'Необходимо подтянуть регламент',
          status: {
            text: 'Не сдан',
            color: 'red'
          }
        }
      ]
    }
  },
  methods: {
    open(item) { }
  }
}
</script>
