import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { sync } from 'vuex-router-sync'
import ExamMePlugin from './plugins/exam-me-plugin'
import store from './store'
// import i18n from './i18n'

Vue.config.productionTip = false

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // La ruta relativa de la carpeta de componentes
  './components/base',
  // Si mirar o no en las subcarpetas
  true,
  // La expresión regular utilizada para hacer coincidir los nombres de los componentes básicos de los ficheros
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Obtener la configuración de los componentes
  const componentConfig = requireComponent(fileName)

  // Obtener el nombre PascalCase del componente
  const componentName = upperFirst(
    // Quitar el `./`en el comienzo y la extensión del nombre del archivo 
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})

sync(store, router)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  created() {
    Vue.use(ExamMePlugin, {
      instance: this
    });
  }
}).$mount('#app')
