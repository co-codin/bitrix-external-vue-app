import Snackbar from './Component'

function Install(Vue, options = {}) {
  const property = options.property || '$snackbar'

  delete options.property
  const { vuetify } = options

  delete options.vuetify
  if (!vuetify) {
    console.warn('Module vuetify-confirm needs vuetify instance. Use Vue.use(VuetifyConfirm, { vuetify })')
  }
  const Ctor = Vue.extend({ vuetify, ...Snackbar })

  function createComponent(options) {
    const container = document.querySelector('[data-app=true]') || document.body
    const cmp = new Ctor({
      propsData: { ...Vue.prototype[property].options, ...options },
      destroyed: () => {
        container.removeChild(cmp.$el)
      }
    })

    container.appendChild(cmp.$mount().$el)
  }

  function show(message, options = {}) {
    options.message = message

    return createComponent(options)
  }

  Vue.prototype[property] = show
  Vue.prototype[property].options = options || {}
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Install)
}

export default Install
