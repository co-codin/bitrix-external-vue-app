import Vue from 'vue'
import AlertBlock from '@/components/wiki/content/AlertBlock'

export function declOfNumber(number, words) {
  const numberDigit2 = Math.abs(number) % 100
  const numberDigit1 = numberDigit2 % 10

  if (numberDigit2 > 10 && numberDigit2 < 20) {
    return words[2]
  }
  if (numberDigit1 > 1 && numberDigit1 < 5) {
    return words[1]
  }
  if (numberDigit1 === 1) {
    return words[0]
  }

  return words[2]
}

export function groupBy(items, key) {
  return items.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {})
}

export function keyBy(items, key) {
  return items.reduce((o, key) => ({ ...o, [key.ID]: { ...key } }), {})
}

export function toTree(dataset, key = 'id', parentKey = 'parent_id', sortKey = 'name') {
  const hashTable = Object.create(null)

  dataset.forEach((item) => (hashTable[item[key]] = { ...item, children: [] }))
  let dataTree = []

  dataset.forEach((item) => {
    if (item[parentKey]) hashTable[item[parentKey]].children.push(hashTable[item[key]])
    else dataTree.push(hashTable[item[key]])
  })
  dataTree = dataTree
    .map((item, index) => {
      return {
        ...item,
        children: dataTree[index].children.sort((a, b) => {
          let ret = 0

          if (a[sortKey] < b[sortKey]) {
            ret = -1
          }
          if (a[sortKey] > b[sortKey]) {
            ret = 1
          }

          return ret
        })
      }
    })
    .sort((a, b) => {
      let ret = 0

      if (a[sortKey] < b[sortKey]) {
        ret = -1
      }
      if (a[sortKey] > b[sortKey]) {
        ret = 1
      }

      return ret
    })

  return dataTree
}

export function renderAlertBlock(type, message) {
  const typeLookupTable = {
    info: {
      icon: 'mdi-information'
    },
    success: {
      icon: 'mdi-check-circle'
    },
    error: {
      icon: 'mdi-alert'
    },
    warning: {
      icon: 'mdi-exclamation'
    }
  }

  return `<div role="alert" class="v-alert v-sheet theme--dark ${type}">
      <div class="v-alert__wrapper">
        <i aria-hidden="true" class="v-icon notranslate v-alert__icon mdi ${typeLookupTable[type].icon} theme--dark"></i>
        <div class="v-alert__content"> ${message} </div>
      </div>
    </div>`
}
