<template>
  <div>
    <template v-if="loading"></template>
    <template v-else-if="error">
      <v-alert type="error" :icon="false" dense>
        {{ error }}
      </v-alert>
    </template>
    <template v-else>
      <h1 class="text-h4 mb-2">Результаты экзамена: {{ examStat.exam.name }}</h1>
      <v-card elevation="1">
        <v-card-title class="title">
          Общая информация
        </v-card-title>
        <v-card-text>
          <div>
            <b>Дата сдачи: </b> <div>{{ examStat.created_at }}</div>
          </div>
          <div class="mt-2">
            <b>Экзаменатор: </b> {{ examStat.examiner.first_name }} {{ examStat.examiner.last_name }}
          </div>
          <div class="mt-2">
            <b>Результат: </b> {{ examStat.statusLabel }}
          </div>
        </v-card-text>
      </v-card>
      <v-card class="mt-2" elevation="1">
        <v-card-title class="title">
          Ответы
        </v-card-title>
        <v-card-text>
          <exam-question-answer
            v-for="(answer, index) in examStat.exam_stat_answers"
            :key="index"
            :answer="answer"
          />
        </v-card-text>
      </v-card>
      <v-card class="mt-2" elevation="1">
        <v-card-title class="title">
          Дополнительные комментарии экзаменатора
        </v-card-title>
        <v-card-text>
          {{ examStat.examiner_comment || '(отсутствуют)' }}
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
import ExamStat from '../../models/ExamStat'
import HasLoadingBar from '@/mixins/hasLoadingBar'
import HasTitle from '@/mixins/hasTitle'
import ExamQuestionAnswer from '../../components/wiki/ExamQuestionAnswer'

export default {
  components: {
    ExamQuestionAnswer
  },
  mixins: [
    HasTitle,
    HasLoadingBar
  ],
  data: () => ({
    examStat: null,
    error: null
  }),
  async created() {
    this.examStat = await ExamStat
      .where('exam_id', this.$route.params.id)
      .include('examStatAnswers.examQuestion.examQuestionAnswerOptions', 'exam', 'examiner')
      .limit(1)
      .orderBy('-created_at')
      .$first()

    if (!this.examStat || !this.examStat.id) {
      this.error = 'Вы еще не сдавали этот экзамен'
    }

    this.hideLoading()
  }
}
</script>
