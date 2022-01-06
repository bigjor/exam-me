import { getTimeLeft } from '@/common/utils/DataUtils'

export default {
  install(Vue, options) {
    const { instance } = options
    
    // Declaramos la instancia de mqtt que tendra la instancie de vue
    Vue.prototype.$mqtt = null

    // Declaramos la instancia para realizar acciones con la aplicacion
    Vue.prototype.$examme = {
      SNACKBAR: {
        show() {
          console.log(instance)
          
        },
        hide() {

        }
      },
      PROMPT: {
        show(options) {
          return instance.$store.dispatch('dialogs/openPrompt', options)
        },
        hide() {
          return instance.$store.dispatch('dialogs/hidePrompt')
        }
      }
    }

    Vue.directive('time-left', {
      bind(el, binding) {
        const action = () => el.innerText = getTimeLeft(binding.value)
        action() && (binding.interval = setInterval(action, 1000))
      },
      unbind(el, binding) {
        clearInterval(binding.interval)
      }
    })

    Vue.directive('grid', {
      inserted: function (el) {
        el.classList.add('grid-table')
      }
    })

    Vue.directive('grid-auto-rows', {
      inserted: function (el) {
        el.classList.add('grid-table-auto-rows')
      }
    })

    Vue.directive('colspan', {
      inserted: function (el, binding) {
        el.style.gridColumn = `span ${binding.value}`
      }
    })
    
  }
}