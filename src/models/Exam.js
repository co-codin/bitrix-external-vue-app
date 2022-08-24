import Model from '@/models/Model'
import ExamQuestion from '@/models/ExamQuestion'

export default class Exam extends Model
{
  resource()
  {
    return 'exams'
  }

  enabled() {
    return this.where('is_enabled', 1)
  }

  questions() {
    return this.hasMany(ExamQuestion)
  }
}
