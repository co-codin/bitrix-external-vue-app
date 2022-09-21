<template>
  <div>
    <v-card class="mt-3">
      <v-card-title>{{ question.name }}</v-card-title>
      <v-card-subtitle>{{ description }}</v-card-subtitle>
      <v-card-text>
        <template v-if="isFreeAnswer">
          <v-textarea
            v-model="value"
            rows="3"
            auto-grow
            class="mt-0"
            outlined
            hide-details
            @input="updateAnswer"
          />
        </template>
        <template v-else-if="hasMultipleAnswers">
          <v-checkbox
            v-for="(answerOption, index) in answerOptions"
            :key="index"
            v-model="value"
            class="mt-0 mb-1"
            hide-details
            :label="answerOption.answer"
            :value="answerOption.id"
            multiple
            @change="updateAnswer"
          />
        </template>
        <template v-else>
          <v-radio-group v-model="value" hide-details class="mt-0" @change="updateAnswer">
            <v-radio
              v-for="(answerOption, index) in answerOptions"
              :key="index"
              color="primary"
              class="mt-0"
              :label="answerOption.answer"
              :value="answerOption.id"
            />
          </v-radio-group>
        </template>
        <div v-if="hasError" class="red--text mt-1">
          <div v-for="(error, index) in errors" :key="index" v-text="error"></div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import ExamQuestion from '@/models/ExamQuestion'
import shuffle from 'lodash/shuffle'

export default {
  props: {
    question: {
      type: ExamQuestion,
      required: true
    },
    errors: {
      type: Array,
      default: () => ([])
    },
    inRandomOrder: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    value: null
  }),
  computed: {
    hasMultipleAnswers() {
      return !!this.question.properties?.has_multiple_answers
    },
    isFreeAnswer() {
      return this.question.answer_type === 'FREE'
    },
    defaultDescription() {
      if (this.isFreeAnswer) {
        return 'Введите развернутый ответ'
      }

      if (this.hasMultipleAnswers) {
        return 'Выберите все правильные ответы'
      }

      return 'Выберите только один правильный ответ'
    },
    description() {
      return this.question.description || this.defaultDescription
    },
    answerOptions() {
      let answerOptions = this.question?.exam_question_answer_options || []

      if (this.inRandomOrder) {
        answerOptions = shuffle(answerOptions)
      }

      return answerOptions
    },
    hasError() {
      return !! this.errors.length
    }
  },
  methods: {
    updateAnswer() {
      this.$emit('input', this.value)
    }
  }
}
</script>
