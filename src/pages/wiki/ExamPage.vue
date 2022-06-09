<template>
  <div>
    <v-container>
      <h1>Экзамен - Регламент "Отдел продаж"</h1>
      <div class="mt-1">
        <v-btn
          href="/wiki/materials"
          text
          depressed
          class="pl-1"
          color="primary"
        >
          <v-icon>mdi-chevron-left</v-icon>
          Вернуться к материалу
        </v-btn>
      </div>
      <v-alert text color="info" class="mt-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium eaque facilis fugiat ipsam laudantium ratione sed sunt ullam velit voluptates. Ad architecto atque consequuntur culpa debitis distinctio ea excepturi fugiat illo laborum, libero necessitatibus nulla numquam omnis placeat possimus quidem quis quo rerum saepe sapiente sint soluta tempora temporibus ullam ut veniam. Autem dignissimos dolor excepturi explicabo harum iste iusto, maiores minus nam odit quisquam similique suscipit tenetur. Alias culpa ea explicabo nemo non repellendus reprehenderit, temporibus ullam vel voluptas. Cupiditate esse expedita fugiat ipsam laboriosam magni mollitia natus, quis sapiente similique? Aperiam atque blanditiis consectetur cumque dicta eligendi quam.
      </v-alert>
      <v-card class="mt-3">
        <v-card-title>Как вы думаете, какой ответ правильный?</v-card-title>
        <v-card-subtitle>Выберите только один вариант ответа</v-card-subtitle>
        <v-card-text>
          <v-radio-group v-model="question1" hide-details class="mt-0">
            <v-radio color="primary" label="Да" value="yes" />
            <v-radio color="primary" label="Нет" value="no" />
          </v-radio-group>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-title>Как вы думаете, какой ответ правильный?</v-card-title>
        <v-card-subtitle>Выберите только один вариант ответа</v-card-subtitle>
        <v-card-text>
          <v-radio-group v-model="question1" hide-details class="mt-0">
            <v-radio color="primary" label="Да" value="yes" />
            <v-radio color="primary" label="Нет" value="no" />
          </v-radio-group>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-title>Опишите кейс отправки запроса на рассрочку</v-card-title>
        <v-card-subtitle>Опишите максимально подробно кейс на отправку рассрочки</v-card-subtitle>
        <v-card-text>
          <v-textarea
            rows="3"
            auto-grow
            class="mt-0"
            outlined
            hide-details
          />
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-title>Как вы думаете, какой ответ правильный?</v-card-title>
        <v-card-subtitle>Выберите все правильные ответы</v-card-subtitle>
        <v-card-text>
          <v-checkbox class="mt-0" label="Вариант 1" />
          <v-checkbox class="mt-0" label="Вариант 2" />
          <v-checkbox class="mt-0" label="Вариант 3" />
          <v-checkbox class="mt-0" label="Вариант 4" />
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-title>Как вы думаете, какой ответ правильный?</v-card-title>
        <v-card-subtitle>Выберите только один вариант ответа</v-card-subtitle>
        <v-card-text>
          <v-radio-group v-model="question1" hide-details class="mt-0">
            <v-radio color="primary" label="Да" value="yes" />
            <v-radio color="primary" label="Нет" value="no" />
          </v-radio-group>
        </v-card-text>
      </v-card>
      <div class="text-center mt-3">
        <v-btn type="submit" color="primary">Отправить на проверку</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    question1: 'no'
  })
}
</script>

<style lang="scss">
.exam-questions {
}
.wiki-exam-question {
  & + .wiki-exam-question {
    margin-top: 30px;
  }
}
</style>
