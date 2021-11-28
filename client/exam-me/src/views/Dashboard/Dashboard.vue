<template>
  <v-main class="background-app dashboard-view">
    <div class="logo">
      <p class="logo-text small">Exam-me</p>
    </div>

    <v-container>
      <div class="header">
        <div>Examenes</div>
      </div>

      <div class="content" v-grid>
        <div class="exam-card" v-for="(exam, key) in exams" :key="key" @click="openExam(key)" @click.middle="openExam(key, '_blank')">
          <div class="card-header">
            <div class="card-title">
              <div class="card-info" :class="{ 'active': exam.active }"></div>
              <div class="card-info-description">{{ exam.title }}</div>
            </div>
            <div class="card-status">
              <v-icon v-if="exam.status === EXAM_STATUS.PASSED" color="#58ED24">mdi-check</v-icon>
              <v-icon v-if="exam.status === EXAM_STATUS.FAILED" color="#ED3C24">mdi-close</v-icon>
            </div>
          </div>

          <div class="card-content">
            <div class="card-row">
              <div class="card-row-left">Respuestas:</div>
              <div class="card-row-right">{{ exam.answered }} / {{ exam.total_questions }}</div>
            </div>

            <div class="card-row">
              <div class="card-row-left">Tiempo restante:</div>
              <div class="card-row-right" v-time-left="exam.end_time"></div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script>

const EXAM_STATUS = {
  UNKNOWN: 0,
  PASSED: 1,
  FAILED: 2
}

export default {
  name: "dashboard",
  data() {
    return {
      EXAM_STATUS,
      exams: {
        "001": {
          title: "Tema 2: Algoritmia",
          active: true,
          total_questions: 44,
          answered: 12,
          status: EXAM_STATUS.PASSED,
          end_time: new Date(2021, 11, 2, 3, 0, 0)
          
        },
        "002": {
          title: "Tema 1: Recuperación",
          active: false,
          total_questions: 32,
          answered: 0,
          status: EXAM_STATUS.FAILED,
          end_time: new Date(2021, 12, 2, 3, 0, 0)
        },
      }
    }
  },
  computed: {
  },
  methods: {
    openExam(id, target) {
      if (!id) return
      if (!this.exams[id].active) return

      if (target === '_blank') {
        const route = this.$router.resolve({
          name: 'Exam',
          params: { id }
        })
        window.open(route.href, '_blank');
        return
      }

      this.$router.push({
        name: 'Exam',
        params: { id }
      });
    }
  }
}
</script>

<style>

.dashboard-view .header {
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

.dashboard-view .content .exam-card {
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


</style>