<template>
  <div>
    <v-container>
      <page-header h1="База знаний" :show-home-link="false" />
      <v-text-field solo placeholder="Поиск по базе знаний..." hide-details class="mb-1" />
      <v-row dense>
        <v-col cols="3">
          <v-card style="position: sticky; top: 25px;">
            <v-treeview
              open-all
              :items="items"
              activatable
              :active="tree"
              item-key="name"
              open-on-click
            >
              <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.file">
                  {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                  {{ files[item.file] }}
                </v-icon>
              </template>
            </v-treeview>
          </v-card>
        </v-col>
        <v-col cols="9">
          <v-card class="material-page">
            <v-card-text class="px-3 py-5">
              <h1 class="text-h3">
                Регламент отдела продаж
              </h1>
              <div class="table-of-contents mt-3">
                <div v-if="showTableOfContents">
                  <transition v-if="showTableOfContents" type="slide-x-transition">
                    <ol>
                      <li>
                        <a href="#" @click.prevent="$vuetify.goTo('#terms', scrollOptions)">Термины и сокращения</a>
                      </li>
                      <li>
                        <a href="#" @click.prevent="$vuetify.goTo('#algorithms', scrollOptions)">Описание алгоритма процесса обработки запросов клиентов</a>
                        <ol>
                          <li>
                            <a href="#" @click.prevent="$vuetify.goTo('#new-leads', scrollOptions)">Обработка запросов новых клиентов</a>
                          </li>
                          <li>
                            <a href="#">Распределение запросов клиентов по специалистам продажам</a>
                          </li>
                          <li>
                            <a href="#">Обработка запроса специалистов по продажам</a>
                          </li>
                          <li>
                            <a href="#">Создание проекта в CRM</a>
                            <ol>
                              <li>
                                <a href="#">Добавление проекта</a>
                              </li>
                              <li>
                                <a href="#">Произвольная заявка</a>
                              </li>
                            </ol>
                          </li>
                        </ol>
                      </li>
                    </ol>
                  </transition>
                </div>
                <div class="mt-6 text-center" style="border-top: 1px solid #e0e0e0">
                  <v-btn
                    color="blue lighten-5"
                    shaped
                    depressed
                    :rounded="false"
                    style="margin-top: -22px; box-shadow: 12px 0 15px -4px #fff, -12px 0 8px -4px #fff;"
                    @click="showTableOfContents = !showTableOfContents"
                  >
                    {{ showTableOfContents ? 'Свернуть' : 'Оглавление' }}
                    <v-icon class="ml-1">
                      {{ showTableOfContents ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </v-btn>
                </div>
              </div>

              <div id="terms" class="wiki-section mt-4">
                <h2 class="text-h4 wiki-section__title">
                  <a href="#terms">1. Термины и сокращения</a>
                </h2>
                <div class="wiki-section__content topic">
                  <table class="table table-bordered">
                    <tbody>
                      <tr>
                        <th>
                          Буфер
                        </th>
                        <td>
                          Портфели клиентов в Bitrix, не закрепленные за специалистом по продажам
                        </td>
                      </tr>
                      <tr>
                        <th>
                          КП
                        </th>
                        <td>
                          Коммерческое предложение
                        </td>
                      </tr>
                      <tr>
                        <th>
                          Специалист по продажам
                        </th>
                        <td>
                          <p>
                            Специалист по продажам по работе с ключевыми клиентами
                          </p>
                          <p>Ведущий специалист по продажам по развитию региона</p>
                          <p>Старший специалист по продажам по развитию региона</p>
                          <p>Специалист по продажам по развитию региона</p>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          Направление
                        </th>
                        <td>
                          Категория оборудования
                        </td>
                      </tr>
                      <tr>
                        <th>Bitrix</th>
                        <td>
                          Учетная система, в которой регистрируется история взаимоотношений с клиентами
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div id="algorithms" class="wiki-section mt-4">
                  <h2 class="text-h4 wiki-section__title">
                    <a href="#algorithms">2. Описание алгоритма процесса обработки запросов клиентов</a>
                  </h2>
                  <div class="wiki-section__content topic">
                    <div id="new-leads" class="wiki-section mt-4">
                      <h2 class="text-h4 wiki-section__title">
                        <a href="#new-leads">2.1 Обработка запросов новых клиентов</a>
                      </h2>
                      <div class="wiki-section__content topic">
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                        <p>
                          Запросы новых клиентов регистрируются 2 способами:
                        </p>
                        <ul>
                          <li>
                            входящий звонок (ответственный за обработку - администратор),
                          </li>
                          <li>
                            заявка на сайте (ответственный за обработку - ассистент).
                          </li>
                        </ul>
                        <p>
                          Входящие звонки, которые фиксирует колл-центр, обрабатываются по алгоритму заявок на сайте.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <v-divider class="my-4" />
              <div class="mb-3">
                <h3 class="text-h4 mt-0">
                  Экзамены
                </h3>
                <v-row dense class="mt-2">
                  <v-col cols="4">
                    <v-card
                      color="#1F7087"
                      dark
                    >
                      <v-card-title class="title">Экзамен для специалиста по продажам</v-card-title>
                      <v-card-subtitle>Сдайте экзамен и получите доступ к эксклюзивному функционалу в Битрикс 24</v-card-subtitle>
                      <v-card-actions>
                        <v-btn href="/wiki/exam" text>Сдать экзамен</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card
                      color="#1F7087"
                      dark
                    >
                      <v-card-title class="title">Экзамен для специалиста отдела закупок</v-card-title>
                      <v-card-subtitle>Сдайте экзамен и получите доступ к эксклюзивному функционалу в Битрикс 24</v-card-subtitle>
                      <v-card-actions>
                        <v-btn href="/wiki/exam" text>Сдать экзамен</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card
                      color="#1F7087"
                      dark
                    >
                      <v-card-title class="title">Экзамен для специалиста по продажам</v-card-title>
                      <v-card-subtitle>Сдайте экзамен и получите доступ к эксклюзивному функционалу в Битрикс 24</v-card-subtitle>
                      <v-card-actions>
                        <v-btn href="/wiki/exam" text>Сдать экзамен</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
              <div v-if="false" class="text-center">
                <v-btn color="primary" large>
                  Ознакомился
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="$vuetify.goTo(0)"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader'

export default {
  components: {
    PageHeader
  },
  data: () => ({
    fab: false,
    breadcrumbs: [{ text: 'База знаний' }],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel'
    },
    scrollOptions: {
      duration: 450,
      offset: 15,
      easing: 'easeInOutCubic'
    },
    showTableOfContents: false,
    tree: ['Регламент отдела продаж'],
    items: [
      {
        name: 'Регламенты',
        children: [
          {
            name: 'Процесс продажи',
            children: [
              {
                name: 'Регламент отдела продаж',
                file: 'txt'
              },
              {
                name: 'Регламент пост-продажного процесса',
                file: 'txt'
              }
            ]
          }
        ]
      },
      {
        name: 'Приказы',
        children: [
          {
            name: 'Переписка только по E-mail',
            file: 'txt'
          },
          {
            name: 'Установка ПО "Стахановец"',
            file: 'txt'
          },
          {
            name: 'Ежедневный отчет о проделанной работе',
            file: 'txt'
          }
        ]
      }
    ]
  }),
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0

      this.fab = top > 40
    }
  }
}
</script>

<style lang="scss">
.material-page {
  h1 {
    color: rgba(0,0,0,.87) !important;
  }
}
.wiki-section {
  color: rgba(0,0,0,.87);
  margin: 30px 0;
  &__title {
    margin-bottom: 30px;
    a {
      text-decoration: none;
      border: none;
      &:hover {
        color: #572fcf;
      }
    }
  }
  &__content {

  }
}
.table-of-contents {
  a {
    text-decoration: none;
    border-bottom: 1px solid #0096c7;
  }
  ol { counter-reset: item; padding-left: 20px; margin-top: 10px; }
  li { display: block; font-size: 16px; margin-bottom: 10px; }
  li:before { content: counters(item, ".") ". "; counter-increment: item }
}
</style>
