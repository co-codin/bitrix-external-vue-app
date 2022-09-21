<script>
import MaterialBlockPopup from '@/components/wiki/content/MaterialBlockPopup'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

export default {
  components: {
    MaterialBlock: () => import('@/components/wiki/MaterialBlock')
  },
  props: {
    blockId: {
      type: Number,
      required: true
    }
  },
  methods: {
    createComponent(component, propsData) {
      const componentCreator = Vue.extend({
        vuetify: new Vuetify,
        router: this.$router,
        ...component
      })

      return new componentCreator({ propsData }).$mount().$el
    },
    async openPopup(event) {
      event.preventDefault()
      const container = document.querySelector('[data-app=true]') || document.body

      container.appendChild(this.createComponent(MaterialBlockPopup, { blockId: this.blockId }))
    }
  },
  render() {
    return this.$scopedSlots.default({
      openPopup: this.openPopup
    })
  }
}
</script>
