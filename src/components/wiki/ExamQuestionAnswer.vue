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
              <div v-html="formattedAnswer"></div>
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
            <div v-if="question.material_blocks && question.material_blocks.length">
              <h3 class="ml-2 text-caption">Полезные материалы</h3>
              <v-list>
                <material-block-link v-for="materialBlock in question.material_blocks" :key="materialBlock.id" v-slot="{ openPopup }" :block-id="materialBlock.id">
                  <v-list-item @click="openPopup">
                    <v-list-item-avatar>
                      <v-icon class="blue white--text">mdi-file</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ materialBlock.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ materialBlock.material.name }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </material-block-link>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import castArray from 'lodash/castArray'
import MaterialBlockLink from '@/components/wiki/content/MaterialBlockLink'

export default {
  components: {
    MaterialBlockLink
  },
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
    formattedAnswer() {
      if (!this.isFreeAnswer) {
        return this.answer.answer
      }

      return this.answer.answer.replace(/\n/g, '<br>')
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
