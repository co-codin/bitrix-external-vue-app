import BX24Wrapper from '@/utils/bx24-wrapper'
import dayjs from 'dayjs'

export default class FillingStatisticsService {

  bx24 = null

  manager = null

  constructor(manager) {
    this.bx24 = new BX24Wrapper()
    this.manager = manager
  }

  static getExportColumns() {
    return [
      { header: 'Компания', key: 'has_company_name', width: 15 },
      { header: 'ИНН', key: 'has_inn', width: 15 },
      { header: 'Контакт', key: 'has_name', width: 15 },
      { header: 'E-mail', key: 'has_email', width: 15 },
      { header: 'Сумма', key: 'has_sum', width: 15 },
      { header: 'Тип клиента', key: 'has_client_type', width: 15 },
      { header: 'Категория', key: 'has_category', width: 15 },
      { header: 'Регион', key: 'has_region', width: 15 },
      { header: 'Активность', key: 'has_planned_call', width: 15 },
      { header: 'Тема звонка', key: 'has_correct_call_description', width: 15 },
      { header: 'Звонок позже 60 дней', key: 'has_planned_call_after_last_call', width: 30 },
      { header: 'Нет просроченныйх звонков', key: 'has_no_overdue_calls', width: 50 },
      { header: 'За последние 60 дней был звонок', key: 'has_recent_calls', width: 50 }
    ]
  }

  static calculateSummary(deals) {
    const summary = {
      name: 0,
      has_company_name: 0,
      has_inn: 0,
      has_name: 0,
      has_sum: 0,
      has_client_type: 0,
      has_category: 0,
      has_region: 0,
      has_email: 0,
      has_planned_call: 0,
      has_correct_call_description: 0,
      has_planned_call_after_last_call: 0,
      has_no_overdue_calls: 0,
      has_recent_calls: 0
    }

    deals.forEach((deal) => {
      summary.has_company_name += !deal.has_company_name ? 1 : 0
      summary.has_inn += deal.has_inn === false ? 1 : 0
      summary.has_name += deal.has_name === false ? 1 : 0
      summary.has_email += deal.has_email === false ? 1 : 0
      summary.has_sum += deal.has_sum === false ? 1 : 0
      summary.has_client_type += deal.has_client_type === false ? 1 : 0
      summary.has_category += deal.has_category === false ? 1 : 0
      summary.has_region += deal.has_region === false ? 1 : 0
      summary.has_planned_call += deal.has_planned_call === false ? 1 : 0
      summary.has_correct_call_description += deal.has_correct_call_description === false ? 1 : 0
      summary.has_planned_call_after_last_call += deal.has_planned_call_after_last_call === false ? 1 : 0
      summary.has_no_overdue_calls += deal.has_no_overdue_calls === false ? 1 : 0
      summary.has_recent_calls += deal.has_recent_calls === false ? 1 : 0
    })

    return summary
  }

  async getData() {
    const deals = await this.getDeals(),dealIds = deals.map((deal) => deal.ID).filter(Boolean)
    const companyIds = deals.map((deal) => deal.COMPANY_ID).filter(Boolean)
    const companies = await this.getCompanies(companyIds)
    const companiesById = companies.reduce((o, key) => ({ ...o, [key.ID]: { ...key } }), {})
    const companyRequisites = await this.getCompanyRequisites(companyIds)
    const now = dayjs()
    const dealContacts = await this.getDealContacts(deals)
    const contactIds = dealContacts.flat().map((dealContact) => dealContact.CONTACT_ID)
    const contacts = await this.getContacts(contactIds)
    const activities = await this.getActivities(2, dealIds, now)
    const contactActivities = await this.getActivities(3, contactIds, now)
    const contactsById = contacts.reduce((o, key) => ({ ...o, [key.ID]: { ...key } }), {})

    return deals.map((deal, index) => {

      const currentDealContacts = dealContacts[index].map((dealContact) => contactsById[dealContact.CONTACT_ID])
      const dealContactActivities = currentDealContacts.map((contact) => contactActivities?.[contact.ID] ?? []).flat()
      const dealActivities = (activities?.[deal.ID] || []).concat(dealContactActivities)
        .sort((a,b) => new Date(b.DEADLINE) - new Date(a.DEADLINE))
      // есть ли просроченные звонки
      const hasNoOverdueCall = ! dealActivities.find((activity) => activity.COMPLETED === 'N' && activity.ASSIGNED_BY_ID === deal.ASSIGNED_BY_ID && dayjs(activity.DEADLINE) < now.subtract(1, 'day'))
      // последний звонок
      const lastCall = dealActivities.find((activity) => activity.COMPLETED === 'Y')
      const nearestPlannedCall = dealActivities
        .find((activity) => activity.COMPLETED === 'N' ?? activity.ASSIGNED_BY_ID === deal.ASSIGNED_BY_ID)
      const hasPlannedCall = !! nearestPlannedCall

      return {
        index: index + 1,
        id: deal.ID,
        name: deal.TITLE,
        has_company_name: ['NEW', 'DETAILS'].includes(deal.STAGE_ID) || !!(companiesById?.[deal.COMPANY_ID]?.TITLE?.length),
        has_inn: ['NEW', 'DETAILS'].includes(deal.STAGE_ID) || !! companyRequisites?.[deal.COMPANY_ID],
        has_name:  !! currentDealContacts.filter((contact) => !! contact.NAME?.length || !! contact.LAST_NAME?.length || contact.SECOND_NAME?.length).length,
        has_email: currentDealContacts?.map((contact) => contact?.HAS_EMAIL).includes('Y') || companiesById?.[deal.COMPANY_ID]?.HAS_EMAIL === 'Y',
        has_sum: ['NEW', 'DETAILS'].includes(deal.STAGE_ID) ? !! deal.UF_PROCEEDS : !! deal.UF_PROCEEDS && deal.UF_PROCEEDS !== '100|RUB',
        has_client_type: !! deal.UF_CRM_CLIENT_TYPE,
        has_category: !! deal.UF_CRM_CATEGORY,
        has_region: !! deal.UF_CRM_DISTRICT,
        has_planned_call: hasPlannedCall,
        has_correct_call_description: hasPlannedCall
          ? !nearestPlannedCall.SUBJECT?.startsWith('Исходящий звонок') || false
          : 'not-available',
        has_planned_call_after_last_call: hasPlannedCall
          ? dayjs(lastCall ? lastCall.DEADLINE : deal.DATE_CREATE).add(60, 'day') >= dayjs(nearestPlannedCall.DEADLINE)
          : 'not-available',
        has_no_overdue_calls: hasPlannedCall ? hasNoOverdueCall : 'not-available',
        has_recent_calls: !! lastCall
      }
    })
  }

  getDeals() {
    return this.bx24.callListMethod('crm.deal.list', {
      order: { 'CLOSEDATE': 'DESC' },
      filter: { 'ASSIGNED_BY_ID': this.manager },
      select: ['ID', 'TITLE', 'COMPANY_ID', 'UF_PROCEEDS', 'ASSIGNED_BY_ID', 'DATE_CREATE', 'STAGE_ID', 'UF_CRM_CATEGORY', 'UF_CRM_CLIENT_TYPE', 'UF_CRM_DISTRICT']
    })
  }

  getCompanies(companyIds) {
    return this.bx24.callListMethod('crm.company.list', {
      filter: { 'ID': companyIds },
      select: ['ID', 'TITLE', 'BANKING_DETAILS', 'HAS_EMAIL']
    })
  }

  async getDealContacts(deals) {
    const dealContactBatch = deals.map((deal) => {
      return [
        'crm.deal.contact.items.get', { id: deal.ID }
      ]
    })

    return await this.bx24.callLongBatch(dealContactBatch, false)
  }

  getContacts(contactIds) {
    return this.bx24.callListMethod('crm.contact.list', {
      filter: { 'ID': contactIds },
      select: [
        'ID',
        'NAME',
        'HAS_EMAIL',
        'LAST_NAME',
        'SECOND_NAME'
      ]
    })
  }

  async getActivities(ownerTypeId, ownerId, now) {
    return (await this.bx24.callListMethod('crm.activity.list', {
      filter: {
        'OWNER_ID': ownerId,
        'OWNER_TYPE_ID': ownerTypeId,
        'TYPE_ID': 2,
        '>=DEADLINE': now.subtract(61, 'day').format('YYYY-MM-DD HH:mm:ss')
      },
      select: ['COMPLETED', 'OWNER_ID', 'OWNER_TYPE_ID', 'DEADLINE', 'ASSIGNED_BY_ID', 'SUBJECT'],
      order: { 'DEADLINE': 'DESC' }
    })).reduce((hash, obj) => ({ ...hash, [obj['OWNER_ID']]:( hash[obj['OWNER_ID']] || [] ).concat(obj) }), {})
  }

  async getCompanyRequisites(companyIds) {
    return (await this.bx24.callListMethod('crm.requisite.list', {
      filter: {
        'ENTITY_ID': companyIds,
        'ENTITY_TYPE_ID': 4
      },
      select: ['ENTITY_ID', 'RQ_INN']
    })).filter((requisite) => !! requisite?.RQ_INN?.length).reduce((o, key) => ({ ...o, [key.ENTITY_ID]: key.RQ_INN }), {})
  }
}
