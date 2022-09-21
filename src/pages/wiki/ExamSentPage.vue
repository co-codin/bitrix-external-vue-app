<template>
  <v-container>
    <v-card class="text-center exam-sent-page pa-3">
      <div class="display-2 mt-10">Экзамен отправлен на проверку</div>
      <div class="mt-3 mb-10">
        Результат придет на почту и изменится индикация на рабочем столе
      </div>
      <div class="text-center justify-center d-flex width-full">
        <v-btn :to="{ name: 'dashboard' }" large color="primary">Рабочий стол</v-btn>
        <div class="px-1"></div>
        <v-btn :to="{ name: 'wiki.index' }" large>База знаний</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<style lang="scss">
.exam-sent-page {
  max-width: 800px !important;
  margin: 0 auto;
}
</style>
