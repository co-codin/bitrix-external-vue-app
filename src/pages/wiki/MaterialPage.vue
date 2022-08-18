<template>
  <div>
    <h1 class="text-h4">
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
              <a href="#" @click.prevent="$vuetify.goTo('#algorithms', scrollOptions)">Описание алгоритма процесса
                обработки запросов клиентов</a>
              <ol>
                <li>
                  <a href="#" @click.prevent="$vuetify.goTo('#new-leads', scrollOptions)">Обработка запросов новых
                    клиентов</a>
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
      <div>
        <v-btn
          color="blue lighten-5"
          shaped
          :rounded="false"
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
    <v-divider class="my-4"/>
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
            <v-card-subtitle>Сдайте экзамен и получите доступ к эксклюзивному функционалу в Битрикс 24
            </v-card-subtitle>
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
            <v-card-subtitle>Сдайте экзамен и получите доступ к эксклюзивному функционалу в Битрикс 24
            </v-card-subtitle>
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
            <v-card-subtitle>Сдайте экзамен и получите доступ к эксклюзивному функционалу в Битрикс 24
            </v-card-subtitle>
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
  </div>
</template>

<script>
export default {

}
</script>
