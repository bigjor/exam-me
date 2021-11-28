export const namespaced = true

export const state = {
  rooms: [],
  room: null,
}

export const actions = {
  setRooms({ commit }, payload) {
    commit('SET_ROOMS', payload)
  },
  setRoom({ commit }, payload) {
    commit('SET_ROOM', payload)
  },
  unsetRoom({ commit }) {
    commit('UNSET_ROOM')
  }
}
export const mutations = {
  SET_ROOMS(state, rooms) {
    state.rooms = rooms
  },
  SET_ROOM(state, room) {
    state.room = room
  },
  UNSET_ROOM(state) {
    state.room = null
  }
}
export const getters = {
  getRooms: state => state.rooms,
  getRoom: state => state.room,
}