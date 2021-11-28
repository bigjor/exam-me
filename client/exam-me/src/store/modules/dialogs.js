export const namespaced = true

const defaultPrompt = {
  opened: false,
  status: false,
  label: '',
  title: '',
  value: '',
  resolve: null,
}


export const state = {
  prompt: defaultPrompt,
}
export const actions = {
  async openPrompt({ commit }, payload) {
    return new Promise(resolve => {
      payload.resolve = resolve
      commit('SET_PROMPT', payload)
      commit('OPEN_PROMPT')
    })
  },
  hidePrompt({ commit }) {
    commit('CLOSE_PROMPT')
  }
}
export const mutations = {
  SET_PROMPT(state, payload) {
    state.prompt = JSON.parse(JSON.stringify(defaultPrompt))

    const originalResolve = payload.resolve
    payload.resolve = () => {
      const result = state.prompt.status ? state.prompt.value : null
      state.prompt.opened = false
      originalResolve(result)
    }
    
    Object.assign(state.prompt, { ...payload })
  },
  OPEN_PROMPT(state) {
    state.prompt.opened = true
  },
  CLOSE_PROMPT() {
    state.prompt.opened = false
  }
}
export const getters = {
  getPrompt: state => state.prompt
}