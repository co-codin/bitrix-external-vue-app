<template>
  <div>
    <template v-if="loading">
      <v-skeleton-loader
        class="mb-2"
        type="heading, button, heading, sentences@4, heading, sentences@4, heading, sentences@4"
      />
    </template>
    <v-form v-else @submit.prevent="passExam">
      <v-container fluid class="pt-0 pb-4">
        <div v-if="exam.material_id" class="mt-1">
          <v-btn :to="{ name: 'wiki.materials.show', params: { id: exam.material_id } }" text class="pl-1" color="primary">
            <v-icon>mdi-chevron-left</v-icon>
            Вернуться к материалу
          </v-btn>
        </div>
        <v-alert v-if="exam.description" text color="info" class="mt-2">
          {{ exam.description }}
        </v-alert>
        <exam-question
          v-for="(question, index) in questions"
          :key="index"
          :question="question"
          :errors="getError(index)"
          @input="updateAnswer(index, $event)"
        />
        <div class="text-center mt-3">
          <v-btn type="submit" color="primary">Отправить на проверку</v-btn>
        </div>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import HasLoadingBar from '@/mixins/hasLoadingBar'
import HasTitle from '@/mixins/hasTitle'
import Exam from '@/models/Exam'
import ExamQuestion from '@/components/wiki/ExamQuestion'
import shuffle from 'lodash/shuffle'
import Form from 'form-backend-validation'

export default {
  components: {
    ExamQuestion
  },
  title() {
    return this.exam?.name || 'База знаний'
  },
  mixins: [HasLoadingBar, HasTitle],
  data: () => ({
    exam: null,
    form: null,
    questions: []
  }),
  async created() {
    await this.loadExam()
    await this.loadExamQuestions()
    this.initializeForm()
    this.hideLoading()
  },
  methods: {
    async loadExam() {
      this.exam = await Exam.$find(this.$route.params.id)
    },
    async loadExamQuestions() {
      this.questions = await this.exam.questions().orderBy('position').$all()

      if (this.exam.questions_in_random_order) {
        this.questions = shuffle(this.questions)
      }
    },
    initializeForm() {
      const answers = this.questions.map((question) => ({
        question_id: question.id,
        answer: null
      }))

      this.form = Form.create({ answers })
        .withOptions({ http: this.$r2d2, resetOnSuccess: true })
    },
    updateAnswer(questionIndex, answer) {
      this.form.answers[questionIndex].answer = answer
    },
    async passExam() {
      try {
        await this.form.post(`/exams/${this.exam.id}/pass`)
        this.$snackbar('Экзамен отправлен на проверку')
        await this.$router.push({ name: 'wiki.index' })
      }
      catch (e) {
        console.log(e)
      }
    },
    getError(questionIndex) {
      const fields = [
        `answers.${questionIndex}.answer`,
        `answers.${questionIndex}.question_id`
      ]

      const errors = []

      fields.forEach((field) => {
        errors.push(...this.form.errors.get(field))
      })

      return errors
    }
  }
}
</script>

<style lang="scss">
.wiki-exam-question {
  & + .wiki-exam-question {
    margin-top: 30px;
  }
}
</style>
