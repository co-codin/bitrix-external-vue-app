<template>
  <v-card :disabled="disabled" :loading="loading" loader-height="6">
    <v-card-title class="pt-5">
      <div
        style="position: absolute; left: 0; top: 10px; color: #fff; padding: 0 8px; height: 24px; line-height: 24px; font-size: 1rem;"
        class="red darken-3"
      >
        академия
      </div>
      <div>План обучения</div>
    </v-card-title>
    <v-timeline v-if="steps.length" class="pa-0" dense align-top>
      <div v-if="false" class="ml-4 mb-2">
        <v-btn small>
          Показать другие завершенные этапы
        </v-btn>
      </div>
      <v-timeline-item v-for="(step, index) in steps" :key="index" :color="step.color" small>
        <strong>{{ step.material.name }}</strong>
        <div v-if="step.comment" class="caption">
          <div>{{ step.comment }}</div>
        </div>
        <div class="timeline-actions mt-1">
          <v-btn v-if="step.material" :to="step.materialLink" x-small>
            Перейти к материалу
          </v-btn>
          <v-btn v-if="step.exam" :disabled="!step.isActionAvailable" x-small :to="step.examLink">
            {{ step.isFailed ? 'Пересдать' : 'Сдать' }} экзамен
          </v-btn>
          <v-btn v-if="step.isFailed || (step.exam && step.isPassed)" x-small :to="step.examResultsLink">
            Ознакомиться с результатами
          </v-btn>
          <v-btn v-if="!step.exam && step.isOpen" :disabled="!step.isActionAvailable" x-small @click="completeStep(step.id)">
            Ознакомился
          </v-btn>
        </div>
      </v-timeline-item>
      <div v-if="false" class="ml-4 mb-1 mt-n1">
        <v-btn small>
          Показать другие запланированные этапы
        </v-btn>
      </div>
    </v-timeline>
    <v-alert
      v-else
      text
      type="info"
      :shaped="false"
      :rounded="false"
      tile
    >
      В плане обучения пока ничего нет
    </v-alert>
  </v-card>
</template>

<script>
import LearningStep from '../../models/LearningStep'

export default {
  data() {
    return {
      loading: true,
      disabled: false,
      steps: []
    }
  },
  async created() {
    await this.loadSteps()
  },
  methods: {
    async loadSteps() {
      try {
        this.steps = await LearningStep.with(['material', 'exam']).orderBy('position').$get()
        this.loading = false
      } catch (e) {
        this.loading = false
        this.error = 'Произошла ошибка при загрузке данных'
      }
    },
    async completeStep(id) {
      try {
        this.loading = true
        this.disabled = true
        await this.$r2d2.post(`/learning-steps/${id}/complete`)
        this.$snackbar('Этап завершен, вы можете перейти к следующему этапу')
        await this.loadSteps()
        this.loading = false
        this.disabled = false
      }
      catch (e) {
        this.loading = false
        this.disabled = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-actions {
  .v-btn {
    margin-right: 5px;
  }
}
</style>
