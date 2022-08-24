import Model from '@/models/Model'

export default class MaterialCategory extends Model
{
  resource() {
    return 'material-categories'
  }

  enabled() {
    return this.where('is_enabled', 1)
  }
}
