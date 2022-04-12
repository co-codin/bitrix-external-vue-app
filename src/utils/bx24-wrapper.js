/**
 * Простой класс-обертка на JavaScript для стандартной JS-библиотеки Битрикс24,
 * позволяющая избежать ада колбеков и работать c асинхронными функциями
 * и асинхронными генераторами ECMAScript 9.
 *
 * @author    andrey-tech
 * @copyright 2019-2021 andrey-tech
 * @see https://github.com/andrey-tech/bx24-wrapper-js
 * @license   MIT
 *
 * @version 1.4.2
 *
 * v1.0.0 (01.12.2019) Начальный релиз
 * v1.1.0 (28.05.2020) Рефакторинг
 * v1.2.0 (02.06.2020) Удален метод init()
 * v1.3.0 (03.06.2020) Добавлен метод getLastResult()
 * v1.4.0 (03.06.2020) Добавлен метод createCalls()
 * v1.4.1 (14.06.2020) Параметр throttle исправлен на 2
 * v1.4.2 (14.02.2021) Рефакторинг
 *
 */
import log from 'echarts/src/scale/Log'

export default class BX24Wrapper {

  /**
   * Конструктор
   */
  constructor() {
    /**
     * Максимальное число команд в одном пакетном запросе callBatch() (не более 50)
     * @type {number}
     */
    this.batchSize = 50

    /**
     * Функция для контроля прогресса выполнения запросов
     * @type {function}
     */
    this.progress = (percent) => {}

    /**
     * Максимальное число запросов к API в секунду (не более 2-х)
     * @type {number}
     * @see https://dev.1c-bitrix.ru/rest_help/rest_sum/index.php
     */
    this.throttle = 5

    /**
     * Последний объект ajaxResult, полученный от библиотеки Битрикс24
     * @type {object}
     * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callMethod.php
     */
    this.lastResult = {}

    /**
     * Время отправки последнего запроса к API, миллисекунды
     * @type {number}
     */
    this.lastRequestTime = 0
  }

  /**
   * Возвращает последний объект ajaxResult, полученный от библиотеки Битрикс24
   * @type {object}
   */
  getLastResult() {
    return this.lastResult
  }

  /**
   * Создает пакет однотипных запросов в виде массива
   * @param  {string} method Метод запроса
   * @param  {array} items Массив параметров запросов
   * @return {array} Пакет запросов
   */
  static createCalls(method, items) {
    const calls = []

    for (const item of items) {
      calls.push([method, item])
    }

    return calls
  }

  /**
   * Вызывает BX24.callMethod() c заданным методом и параметрами и возвращает объект промис
   * @param  {string} method Метод запроса
   * @param  {object} params Параметры запроса
   * @return {object} Promise
   * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callMethod.php
   */
  async callMethod(method, params = {}) {
    await this.throttleCall()

    return new Promise((resolve, reject) => {
      const callback = (result) => {
        this.lastResult = result
        if (result.status !== 200 || result.error()) {

          return reject(new Error(`${result.error()} (callMethod ${method}: ${JSON.stringify(params)})`))
        }

        return resolve(result.data())
      }

      BX24.callMethod(method, params, callback)
    })
  }

  /**
   * Вызывает BX24.callMethod() с заданным списочным методом и параметрами и возвращает объект промис
   * @param  {string} method Списочный метод запроса
   * @param  {object} params Параметры запроса
   * @return {object} Promise
   * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callMethod.php
   */
  async callListMethod(method, params = {}) {
    await this.throttleCall()

    return new Promise((resolve, reject) => {
      let data = []

      this.progress(0)

      const callback = async (result) => {
        this.lastResult = result

        if (result.status !== 200 || result.error()) {
          return reject(new Error(`${result.error()} (callListMethod ${method}: ${JSON.stringify(params)})`))
        }

        data = data.concat(result.data())

        const total = result.total()

        this.progress(total > 0 ? Math.round(100 * data.length / total) : 100)

        if (! result.more()) {
          return resolve(data)
        }

        await this.throttleCall()
        result.next()
      }

      BX24.callMethod(method, params, callback)
    })
  }

  async callBatchListMethod(method, params = {}) {

    return new Promise((resolve, reject) => {
      let data = []

      const callback = async (result) => {
        this.lastResult = result

        if (result.status !== 200 || result.error()) {
          return reject(new Error(`${result.error()} (callBatchListMethod ${method}: ${JSON.stringify(params)})`))
        }

        data = data.concat(result.data())

        if (params.limit && data.length >= params.limit) {
          return resolve(data.slice(0, params.limit))
        }

        if (! result.more()) {
          return resolve(data)
        }

        const calls = this.generateCalls(method, result.answer.next, result.total(), params)

        const response = await this.callLongBatch(calls)

        return resolve(data.concat(response.flat()).slice(0, params.limit))
      }

      BX24.callMethod(method, params, callback)
    })
  }

  generateCalls(method, next, total, params = {}) {

    const calls = []

    for (let i = next; i < total; i += next) {
      params.start = i
      calls.push([
        method, { ...params }
      ])
      if (params.limit && i + next >= params.limit) break
    }

    return calls
  }

  /**
   * Вызывает BX24.callMethod() с заданным списочным методом и параметрами и возвращает объект генератор
   * Реализует быстрый алгоритм, описанный в https://dev.1c-bitrix.ru/rest_help/rest_sum/start.php
   * @param  {string} method Списочный метод запроса
   * @param  {object} params Параметры запроса
   * @return {object} Generator
   * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callMethod.php
   */
  async *fetchList(method, params = {}) {
    params.order = params.order || {}
    params.filter = params.filter || {}
    params.order['ID'] = 'ASC'
    params.filter['>ID'] = 0
    params.start = -1

    let counter = 0,
      total = 0

    this.progress(0)

    do {
      // eslint-disable-next-line no-await-in-loop
      const data = await this.callMethod(method, params),
        result = this.lastResult

      if (params.filter['>ID'] === 0) {
        total = result.total()
      }

      counter += data.length
      this.progress(total > 0 ? Math.round(100 * counter / total) : 100)

      if (data.length === 0) {
        break
      }

      yield data

      if (! result.more()) {
        break
      }

      params.filter['>ID'] = data[data.length - 1]['ID']

    } while (true)
  }

  /**
   * Вызывает BX24.callBatch() с максимальным числом команд не более 50 и возвращает объект промис
   * @param  {array|object} calls Пакет запросов
   * @param  {boolean} haltOnError Прерывать исполнение пакета в при возникновении ошибки
   * @return {object} Promise
   * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callBatch.php
   */
  async callBatch(calls, haltOnError = true) {
    await this.throttleCall()

    return new Promise((resolve, reject) => {
      const callback = (results) => {
        this.lastResult = results
        let data

        if (Array.isArray(results)) {
          data = []
          for (const result of results) {
            if (result.status !== 200 || result.error()) {
              return reject(new Error(`${result.error()} (callBatch ${result.query.method}: ${result.query.data})`))
            }
            data.push(result.data())
          }
        } else {
          data = {}
          for (const key of Object.keys(results)) {
            const result = results[key]

            if (result.status !== 200 || result.error()) {
              return reject(new Error(`${result.error()} (callBatch ${result.query.method}: ${result.query.data})`))
            }
            data[key] = result.data()
          }
        }

        return resolve(data)
      }

      BX24.callBatch(calls, callback, haltOnError)
    })
  }

  /**
   * Вызывает BX24.callBatch() с произвольным числом запросов и возвращает объект промис
   * @param  {array} calls Пакет запросов
   * @param  {boolean} haltOnError Прерывать исполнение пакета в при возникновении ошибки
   * @return {object} Promise
   * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callBatch.php
   */
  async callLongBatch(calls, haltOnError = true) {
    if (! Array.isArray(calls)) {
      throw new Error('Parameter \'calls\' must be an array')
    }

    let data = [],
      // eslint-disable-next-line prefer-const
      total = calls.length,
      start = 0

    this.progress(0)

    do {
      const end = start + this.batchSize,
        chunk = calls.slice(start, end)

      // eslint-disable-next-line no-await-in-loop
      const response = await this.callBatch(chunk, haltOnError)

      data = data.concat(response)

      this.progress(total > 0 ? Math.round(100 * data.length / total) : 100)

      start = end
      if (start >= total) {
        break
      }

      // eslint-disable-next-line no-constant-condition
    } while (true)

    return data
  }

  /**
   * Вызывает BX24.callBatch() с произвольным числом команд в запросе и возвращает объект генератор
   * @param  {array} calls Пакет запросов
   * @param  {boolean} haltOnError Прерывать исполнение пакета в при возникновении ошибки
   * @return {object} Generator
   * @see https://dev.1c-bitrix.ru/rest_help/js_library/rest/callBatch.php
   */
  async *callLargeBatch(calls, haltOnError = true) {
    if (! Array.isArray(calls)) {
      throw new Error('Parameter \'calls\' must be an array')
    }

    // eslint-disable-next-line prefer-const
    let total = calls.length,
      counter = 0,
      start = 0

    this.progress(0)

    do {
      const end = start + this.batchSize,
        chunk = calls.slice(start, end)

      // eslint-disable-next-line no-await-in-loop
      const data = await this.callBatch(chunk, haltOnError)

      counter += data.length
      this.progress(total > 0 ? Math.round(100 * counter / total) : 100)

      yield data

      start = end
      if (start >= total) {
        break
      }

    } while (true)
  }

  /**
   * Обеспечивает троттлинг запросов к API Битрикс24 на заданном уровне
   * @return {object} Promise
   */
  throttleCall() {
    return new Promise((resolve) => {
      const timeout = Math.round(this.lastRequestTime + 1e3 * (1 / this.throttle) - Date.now())

      if (timeout <= 0) {
        this.lastRequestTime = Date.now()

        return resolve()
      }
      setTimeout(() => {
        this.lastRequestTime = Date.now()

        return resolve()
      }, timeout)
    })
  }
}