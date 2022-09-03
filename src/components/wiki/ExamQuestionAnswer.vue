<template>
  <div>
    <v-card tile outlined>
      <v-card-title>
        <svg-icon
          :key="statusIcon.icon"
          :name="statusIcon.icon"
          :class="`${statusIcon.color} mr-1`"
          width="24"
          height="24"
        />
        {{ question.name }}
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="8">
            <template v-if="isFreeAnswer">
              {{ answer.answer }}
            </template>
            <template v-else>
              <div v-for="(answerOption, index) in answerOptions" :key="index">
                <v-list-item dense class="pl-0">
                  <v-list-item-icon>
                    <div v-if="isSelected(answerOption.id)">
                      <svg-icon name="check-circle" :class="answerOption.is_correct ? 'green--text' : 'red--text'" />
                    </div>
                    <div v-else>
                      <svg-icon name="stop" />
                    </div>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title :class="answerOption.is_correct ? 'green--text' : 'red--text'" v-text="answerOption.answer"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </template>
          </v-col>
          <v-col cols="4">
            <div v-if="answer.examiner_comment">
              <strong>Комментарий экзаменатора:</strong>
              <div>{{ answer.examiner_comment }}</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import castArray from 'lodash/castArray'

export default {
  props: {
    answer: {
      type: Object,
      required: true
    }
  },
  computed: {
    question() {
      return this.answer.exam_question
    },
    isFreeAnswer() {
      return this.question.answer_type === 'FREE'
    },
    answerOptions() {
      return this.question?.exam_question_answer_options || []
    },
    correctAnswerOptionIds() {
      return this.answerOptions
        .filter((answer_option) => answer_option.is_correct)
        .map((answer_option) => answer_option.id)
    },
    isCorrect() {
      return this.answer.status === 'PASSED'
    },
    statusIcon() {
      if (this.isCorrect) {
        return {
          icon: 'check-circle',
          color: 'green--text'
        }
      }

      if (this.isCorrect === false) {
        return {
          icon: 'x-circle',
          color: 'red--text'
        }
      }

      return {
        icon: 'question-mark-circle',
        color: 'orange--text'
      }
    }
  },
  methods: {
    isSelected(answerOptionId) {
      return castArray(this.answer.answer).includes(answerOptionId)
    }
  }
}
</script>
