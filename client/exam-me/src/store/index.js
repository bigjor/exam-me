import Vue from 'vue'
import Vuex from 'vuex'

import * as rooms from './modules/rooms'
import * as exams from './modules/exams'
import * as dialogs from './modules/dialogs'

Vue.use(Vuex)

const state = {}
const mutations = {}
const getters = {}
const actions = {}
const modules = {
  rooms,
  exams,
  dialogs
}

export default new Vuex.Store({
  namespaced: true,
  state,
  modules,
  mutations,
  getters,
  actions
})
