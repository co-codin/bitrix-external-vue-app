<template>
  <v-card>
    <v-card-title class="pt-5">
      <div style="position: absolute; left: 0; top: 10px; color: #fff; padding: 0 8px; height: 24px; line-height: 24px; font-size: 1rem;" class="orange darken-3">
        academy
      </div>
      <div>{{ selectedTab.text }}</div>
      <v-spacer></v-spacer>
      <v-menu offset-y left transition="slide-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group v-model="tab">
            <v-list-item
              v-for="item in tabs"
              :key="item.key"
              :to="item.link"
              :exact="item.exact"
              :disabled="item.disabled"
              :value="item.key"
              selectable
              link
            >
              <v-list-item-icon>
                <v-icon small :class="{ 'grey--text': item.disabled }">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-card-title>

    <component :is="selectedTab.component" />
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tab: 'plan',
      tabs: [
        { icon: 'mdi-clock-outline', text: 'План обучения', key: 'plan', component: () => import('@/components/dashboard/TrainingPlanCard') },
        { icon: 'mdi-lead-pencil', text: 'Экзамены', key: 'exams', component: () => import('@/components/dashboard/ExamListCard') }
      ]
    }
  },
  computed: {
    selectedTab() {
      return this.tabs.find((tab) => tab.key === this.tab)
    }
  }
}
</script>
