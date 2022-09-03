import Model from './Model'

export default class ExamStat extends Model {

  resource() {
    return 'exam-stats'
  }

  get statusLabel() {
    if (this.status === 'PASSED') {
      return 'Сдан'
    }

    if (this.status === 'FAILED') {
      return 'Провален'
    }

    return 'На проверке'
  }

}
