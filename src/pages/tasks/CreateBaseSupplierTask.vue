<template>
  <div>
    <page-header h1="Создание задачи на закупщика" :show-home-link="false"/>
    <v-form>
      <v-expansion-panels v-model="panels" multiple>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">
            Общая информация
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-autocomplete
              v-model="form.document"
              label="Документ"
              placeholder="Выберите документ"
              :items="documents"
              dense
            />
            <v-autocomplete
              v-model="form.assigned_by_id"
              label="Закупщик"
              placeholder="Выберите закупщика"
              :items="suppliers"
              dense
            />
            <div class="d-flex align-center">
              <div class="width-full">
                <date-picker-field
                  v-model="form.end_date"
                  dense
                  label="Крайний срок"
                  placeholder="Выберите крайний срок"
                />
              </div>
              <div class="ml-1">
                <v-menu v-model="showEndDateCalculator" offset-y allow-overflow :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      title="Рассчитать крайний срок"
                      v-on="on"
                    >
                      <calculator-icon/>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <date-picker-field
                        v-model="endDateCalculator.start_date"
                        dense
                        label="Крайний срок"
                        placeholder="Выберите крайний срок"
                      />
                      <v-text-field
                        v-model.number="endDateCalculator.days"
                        label="Дней"
                        dense
                      />
                      <v-select
                        v-model="endDateCalculator.day_type"
                        label="Тип дней"
                        :items="dayTypes"
                        dense
                      />
                      <v-btn color="primary" block @click="calculateEndDate">
                        Рассчитать
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </div>
            </div>
            <v-textarea
              v-model="form.auction"
              label="Ссылка на аукцион"
              dense
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel :readonly="!form.specification.changed">
          <v-expansion-panel-header :hide-actions="!form.specification.changed" class="title align-center">
            <div class="d-sm-flex align-center">
              <div>
                Спецификация
              </div>
              <div>
                <v-switch
                  :value="form.specification.changed"
                  class="ml-sm-2 mt-0"
                  hide-details
                  label="Есть изменения в спецификации"
                  inset
                  @click.stop="toggleSpecification"
                />
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-textarea
              v-model="form.specification.changes"
              dense
              label="Изменения в спецификации"
              placeholder="Перечислите все изменения в спецификации"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">
            Поставка оборудования
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-textarea
              v-model="form.supply.address"
              dense
              label="Адрес поставки"
              placeholder="Введите адрес поставки"
            />
            <v-textarea
              v-model="form.supply.term"
              dense
              label="Срок поставки"
              placeholder="Введите договоренности с клиентом по срокам поставки"
            />
            <v-switch
              v-model="form.supply.agreement"
              label="Есть договоренности с поставщиком / производителем"
              dense
              inset
            />
            <v-textarea
              v-if="form.supply.agreement"
              v-model="form.supply.term"
              dense
              label="Договоренности по доставке и разгрузке"
            />
            <v-card>
              <v-card-title>Контактное лицо для приемки оборудования</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="form.supply.contact.name"
                  label="Имя"
                  dense
                />
                <v-text-field
                  v-model="form.supply.contact.phone"
                  label="Телефон"
                  dense
                />
                <v-text-field
                  v-model="form.supply.contact.email"
                  label="Email"
                  dense
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel :readonly="!form.installation.has">
          <v-expansion-panel-header :hide-actions="!form.installation.has" class="title align-center">
            <div class="d-sm-flex align-center">
              <div>
                Установка
              </div>
              <div>
                <v-switch
                  :value="form.installation.has"
                  class="ml-sm-2 mt-0"
                  hide-details
                  label="Требуется установка"
                  inset
                  @click.stop="toggleInstallation"
                />
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-textarea
              v-model="form.installation.address"
              dense
              rows="3"
              label="Адрес установки"
            />
            <v-textarea
              v-model="form.installation.agreement"
              dense
              rows="3"
              label="Договоренности по установке оборудования"
            />
            <v-card>
              <v-card-title>Контактное лицо для установки оборудования</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="form.installation.contact.name"
                  label="Имя"
                  dense
                />
                <v-text-field
                  v-model="form.installation.contact.phone"
                  label="Телефон"
                  dense
                />
                <v-text-field
                  v-model="form.installation.contact.email"
                  label="Email"
                  dense
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title">
            Отправка документов
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-textarea
              v-model="form.documents.comment"
              label="Комментарий"
              dense
              rows="4"
            />
            <v-card>
              <v-card-title>Контактное лицо для установки оборудования</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="form.documents.name"
                  label="Имя"
                  dense
                />
                <v-text-field
                  v-model="form.documents.phone"
                  label="Телефон"
                  dense
                />
                <v-text-field
                  v-model="form.documents.email"
                  label="Email"
                  dense
                />
              </v-card-text>
            </v-card>
            <v-switch
              v-model="form.documents.edo.has"
              label="Есть ЭДО"
              dense
              inset
            />
            <v-text-field
              v-if="form.documents.edo.has"
              v-model="form.documents.edo.name"
              label="Наименование ЭДО"
              dense
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="text-right mt-2">
        <v-btn type="submit" color="success">Поставить задачу</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import PageHeader from '../../components/PageHeader'
import DatePickerField from '../../components/DatePickerField'
import CalculatorIcon from '@/components/heroicons/CalculatorIcon'

export default {
  components: {
    PageHeader,
    DatePickerField,
    CalculatorIcon
  },
  data: () => ({
    documents: [
      { text: 'Договор поставки № 1202/23 от 10.02.2022', value: 1 },
      { text: 'Договор поставки № 3421/23 от 11.02.2022', value: 2 },
      { text: 'Договор поставки № 213/23 от 03.02.2022', value: 3 },
      { text: 'Счет-договор № 3112 от 01.02.2022', value: 4 }
    ],
    suppliers: [
      { text: 'Михаил Великий', value: 1 },
      { text: 'Иван Петров', value: 2 },
      { text: 'Михаил Петров', value: 3 }
    ],
    dayTypes: [
      { text: 'рабочих', value: 'work' },
      { text: 'календарных', value: 'calendar' }
    ],
    form: {
      document: null,
      assigned_by_id: null,
      end_date: null,
      specification: {
        changed: false,
        changes: null
      },
      auction: null,
      supply: {
        address: null,
        agreement: false,
        contact: {
          name: null,
          phone: null,
          email: null
        }
      },
      installation: {
        has: false,
        contact: {
          name: null,
          phone: null,
          email: null
        },
        agreement: null
      },
      documents: {
        contact: {
          name: null,
          phone: null,
          email: null
        },
        comment: null,
        edo: {
          has: false,
          name: null
        }
      }
    },
    endDateCalculator: {
      start_date: null,
      days: null,
      day_type: 'work'
    },
    showEndDateCalculator: false,
    panels: [0]
  }),
  methods: {
    calculateEndDate() {
      alert('calculating...')
      this.showEndDateCalculator = false
    },
    toggleSpecification() {
      this.form.specification.changed = !this.form.specification.changed

      if (!this.form.specification.changed) {
        this.closePanel(1)
      }
      else {
        this.openPanel(1)
      }
    },
    toggleInstallation() {
      this.form.installation.has = !this.form.installation.has

      if (!this.form.installation.has) {
        this.closePanel(3)
      }
      else {
        this.openPanel(3)
      }
    },
    openPanel(number) {
      const index = this.panels.indexOf(number)

      if (index === -1) {
        this.panels.push(number)
      }
    },
    closePanel(number) {
      const index = this.panels.indexOf(number)

      if (index !== -1) {
        this.panels.splice(index, 1)
      }
    }
  }
}
</script>

<style>
.v-input__append-outer {
  cursor: pointer;
}
</style>
