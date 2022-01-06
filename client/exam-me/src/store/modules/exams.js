export const namespaced = true

export const state = {
  exams: [],
  exam: null,
}

export const actions = {
  setExams({ commit }, payload) {
    if (Array.isArray(payload)) { 
      commit('SET_EXAMS', payload)
    } else {
      const { exams, roomId } = payload
      commit('SET_EXAMS', exams.filter(exam => exam.roomId === roomId))
    }
  },
  setExam({ commit }, payload) {
    commit('SET_EXAM', payload)
  },
  setExamById({ commit }, payload) {
    commit('SET_EXAM_BY_ID', payload)
  },
  unsetExam({ commit }) {
    commit('UNSET_EXAM')
  }
}
export const mutations = {
  SET_EXAMS(state, exams) {
    state.exams = exams
  },
  SET_EXAM(state, exam) {
    state.exam = exam
  },
  SET_EXAM_BY_ID(state, examId) {
    state.exam = state.exams.find(exam => exam._id === examId)
  },
  UNSET_EXAM(state) {
    state.exam = null
  }
}
export const getters = {
  getExams: state => state.exams,
  getExam: state => state.exam,
}