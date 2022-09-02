import Model from './Model'

export default class LearningStep extends Model
{
  resource() {
    return 'auth/learning-steps'
  }

  static statusColors = {
    OPEN: 'primary',
    ON_MODERATION: 'warning',
    PASSED: 'success',
    FAILED: 'error',
    NOT_AVAILABLE: 'grey'
  }

  get color() {
    return LearningStep.statusColors[this.status]
  }

  get materialLink() {
    return { name: 'wiki.materials.show', params: { id: this.material_id } }
  }

  get examLink() {
    return { name: 'wiki.exams.show', params: { id: this.exam_id } }
  }

  get examResultsLink()
  {
    return { name: 'wiki.exams.results', params: { id: this.exam_id } }
  }

  get isActionAvailable() {
    return this.status === 'OPEN' || this.status === 'FAILED'
  }

  get isOpen() {
    return this.status === 'OPEN'
  }

  get isFailed() {
    return this.status === 'FAILED'
  }

  get isPassed() {
    return this.status === 'PASSED'
  }
}
