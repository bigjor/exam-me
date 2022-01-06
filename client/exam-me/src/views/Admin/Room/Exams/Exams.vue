<template>
  <v-container class="exams">
    <div class="content" v-grid>
      <div class="exam-card create-card" @click="createExam()">
        <div>
          <v-icon x-large color="#555">mdi-plus</v-icon>
        </div>
        <div> Create Exam </div>
      </div>
      <div class="exam-card" v-for="(exam, key) in getExams()" :key="key" @click="editExam(exam)">
        <div class="card-header">
          <div class="card-title">
            <div class="card-info" :class="{ 'active': exam.active }"></div>
            <div class="card-info-description">{{ getExamName(exam) }}</div>
          </div>
          <div class="card-status" @click="toggleStatusExam(exam)">
            <v-icon color="#ED3C24">mdi-power</v-icon>
          </div>
        </div>

        <div class="card-content">
          <div class="card-row">
            {{ getExamDescription(exam) }}
          </div> 
          <div class="card-row">
            <div class="card-row-left">End date:</div>
            <div class="card-row-right">
              {{ getExamDate(exam) }}
            </div>
          </div> 
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'exams',
  props: {
    roomId: String
  },
  data () {
    return {
      exam: {
        loading: true,
      },
    }
  },
  methods: {
    getCode () {
      return this.room?.code || ''
    },
    getExams() {
      return (this.exams || []).filter(exam => exam.room_id === this.roomId)
    },
    createExam() {
      let route_parts = this.$route.fullPath.split('/')
      route_parts.pop()
      route_parts.push(`exam`)
      const path = route_parts.join('/')
      this.$router.push({ path })
    },
    editExam(exam) {
      let route_parts = this.$route.fullPath.split('/')
      route_parts.pop()
      route_parts.push(`exam/${exam._id}`)
      const path = route_parts.join('/')
      this.$router.push({ path })
    },
    getExamName(exam) {
      return exam.content[0].children[0].value
    },
    getExamDescription(exam) {
      return exam.content[0].children[1].value
    },
    getExamDate(exam) {
      return exam.content[0].children[2].value + ' ' + exam.content[0].children[3].value
    },
  },
  computed: {
    ...mapGetters({
      room: 'rooms/getRoom',
      exams: 'exams/getExams'
    }),
  },

}
</script>

<style scoped>
.exams .header {
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  padding: 12px 24px;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;

  color: #555555;

  margin-bottom: 12px;
}

.exams .content .exam-card {
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  padding: 26px;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: space-between;

  cursor: pointer;
}

.exams .content .create-card {
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
}

.exams .content .create-card div {
  margin: 8px;
}
</style>