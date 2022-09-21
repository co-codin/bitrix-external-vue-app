import Model from '@/models/Model'
import MaterialBlock from '@/models/MaterialBlock'
import { MaterialStatus } from '@/enums/MaterialStatus'

export default class Material extends Model
{
  resource()
  {
    return 'materials'
  }

  enabled() {
    return this.where('status', 'ACTIVE')
  }

  blocks() {
    return this.hasMany(MaterialBlock)
  }

  isActive() {
    return this.status === MaterialStatus.ACTIVE
  }

  isAvailable() {
    return this.status === MaterialStatus.ACTIVE || this.status === MaterialStatus.ACTIVE_BY_LINK
  }
}
