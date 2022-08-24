import Model from '@/models/Model'
import MaterialBlock from '@/models/MaterialBlock'

export default class Material extends Model
{
  resource()
  {
    return 'materials'
  }

  enabled() {
    return this.where('is_enabled', 1)
  }

  blocks() {
    return this.hasMany(MaterialBlock)
  }
}
