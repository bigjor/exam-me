<template>
  <div class="exam">
    <v-container>
      <div class="content">
        <v-form
          ref="exam_form"
          v-model="valid"
          lazy-validation
        >
          <div v-for="(obj, index) in getExamContent()" :key="`obj-${index}`" :class="{ 'header-style': obj.style == 'header' }">
            <div class="exam-row" v-grid v-grid-auto-rows v-if="obj.type == 'group'">
              <div v-for="(item_grp, index_grp) in obj.children" :key="`item-grp-${index}-${index_grp}`">
                <v-text-field
                  v-if="item_grp.type == 'string'"
                  v-model="item_grp.value"
                  :label="item_grp.label"
                  :counter="item_grp.length"
                  :rules="getRulesString(item_grp)"
                  :required="item_grp.required"
                  filled
                ></v-text-field>
                <v-text-field
                  v-if="item_grp.type == 'date'"
                  v-model="item_grp.value"
                  :label="item_grp.label"
                  type="date"
                  :required="item_grp.required"
                  filled
                ></v-text-field>
                <v-text-field
                  v-if="item_grp.type == 'time'"
                  v-model="item_grp.value"
                  :label="item_grp.label"
                  type="time"
                  :required="item_grp.required"
                  filled
                ></v-text-field>
              </div>
            </div>

            <div class="exam-row" v-if="obj.type == 'question'">
              <div class="question-header">
                <div>Question {{ index }}</div>

                <v-btn
                  icon
                  color="error"
                  @click="removeQuestion(index)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>

              <div class="question-title">
                <v-text-field
                  v-model="obj.title"
                  :label="'Title'"
                  :rules="[v => !!v || 'Title required']"
                  append-icon="mdi-help"
                  filled
                ></v-text-field>
                <v-select
                  v-model="obj.question_type"
                  :items="question_types"
                  :item-text="'text'"
                  :item-value="'value'"
                  label="Type"
                  filled
                ></v-select>
              </div>

              <div class="question-answers" v-if="hasAnswers(obj)">
                <div class="question-answer" v-for="(answer, index_answer) in getAnswers(obj)" :key="`answer-${index}-${index_answer}`">
                  <div>{{ index_answer + 1 }}.</div>

                  <v-text-field
                    v-model="answer.text"
                    :label="`Option ${index_answer + 1}`"
                    :rules="[v => !!v || 'Option required']"
                    hide-details
                    append-outer-icon="mdi-close"
                    @click:append-outer="removeAnswer(index, index_answer)"
                    filled
                  ></v-text-field>
                </div>

                <div class="question-answer">
                  <div>{{ getAnswers(obj).length + 1 }}.</div>
                  <div>
                    <v-btn
                      plain
                      @click="addAnswer(obj)"
                    >
                      Add answer
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

            <v-divider v-if="index != (getExamContent().length - 1)"></v-divider>
          </div>

          <v-row class="buttons">
            <v-col xs="12">
              <!-- cols="12" md="6" lg="6" xl="6" -->
              <v-btn
                block
                depressed
                color="third"
                dark
                @click="addQuestion"
              >
                Add Question
              </v-btn>
            </v-col>
            <v-col xs="12">
              <!-- cols="12" md="6" lg="6" xl="6" -->
              <v-btn
                block
                depressed
                color="background"
                dark
                @click="saveExam"
              >
                Save
              </v-btn>
            </v-col>
            <v-col xs="12" v-if="examId">
              <!-- cols="12" md="6" lg="6" xl="6" -->
              <v-btn
                block
                depressed
                color="error"
                dark
                @click="saveExam"
              >
                Delete
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AdminExam',
  props: {
    examId: { type: String },
    roomId: { type: String },
  },
  data() {
    return {
      valid: true,
      question_types: [
        {
          text: 'Texto',
          value: 'text',
        },
        {
          text: 'Texto Largo',
          value: 'longtext',
        },
        {
          text: 'Seleccionable',
          value: 'select',
        },
        {
          text: 'Casillas de verificación',
          value: 'checkboxes'
        },
        {
          text: 'Opciones de botones',
          value: 'radiobuttons'
        },
        {
          text: 'Fecha',
          value: 'date'
        },
        {
          text: 'Hora',
          value: 'time'
        }
      ],
      exam: null
    }
  },
  watch: {
    savedExam: function(newVal) {
      this.valid = true
      this.exam = newVal
    },
    exam: function(newVal) {
      if (!newVal) this.setupExam()
      this.valid = true
    },
  },
  methods: {
    ...mapActions('exams', {
      setExam: 'setExamById',
      unsetExam: 'unsetExam',
    }),
    addQuestion() {
      this.exam?.content?.push({
        title: undefined,
        question_type: 'text',
        type: 'question', // select, checkbox, radio, text, number, date, time, textarea
      })
    },
    addAnswer(question) {
      if (!question.answers) question.answers = []
      question.answers.push({
        text: '',
      })
      this.$forceUpdate()
    },
    removeAnswer(index_question, index_answer) {
      this.exam?.content[index_question].answers.splice(index_answer, 1)
      this.$forceUpdate()
    },
    getAnswers(question) {
      return question.answers || []
    },
    hasAnswers(question) {
      return  question.question_type == 'select' || 
              question.question_type == 'checkboxes' || 
              question.question_type == 'radiobuttons'
    },
    
    removeQuestion(index) {
      this.exam?.content?.splice(index, 1)
    },
    saveExam() {
      if (this.$refs.exam_form.validate()) {
        window.mqtt.publish(`/`, {
          action: 'room/exam/save',
          body: {
            _id: this.examId,
            exam: this.exam,
          }
        })

        this.$router.replace({
          name: 'Exams',
        })
      }
    },
    getRulesString(args) {
      let rules = []
      if (args.length) {
        rules.push(v => v?.length <= args?.length || 'Characters overflowed')
      }
      return rules
    },
    getExamContent() {
      return this.exam?.content || []
    },
    setupExam() {
      this.exam = {
        roomId: this.roomId,
        content: [
          {
            type: 'group',
            style: 'header',
            children: [
              {
                type: 'string',
                length: 30,
                required: true,
                label: 'Name',
              },
              {
                type: 'string',
                length: 30,
                required: true,
                label: 'Description',
              },
              {
                type: 'date',
                required: true,
                label: 'Date',
              },
              {
                type: 'time',
                required: true,
                label: 'End Time',
              }
            ],
          },
        ]
      }
    },
  },
  computed: {
    ...mapState({
      savedExam: state => state.exams.exam,
    }),
  },
  mounted() {
    window.adminExam = this
    this.valid = true
    if (!this.examId) {
      this.setupExam()
    } else {
      this.setExam(this.examId)
    }
  },
  beforeDestroy() {
    this.unsetExam()
  },
}
</script>

<style scoped>

.exam .content {
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  padding: 12px 24px;

  font-family: Roboto;
  font-style: normal;
  
  text-transform: uppercase;

  color: #555555;

  margin-bottom: 12px;
}

.exam .content .header-style {
  font-weight: bold;
  font-size: 18px;
}

.exam .content .buttons {
  margin-top: 12px;
}

.exam .content .exam-row {
  margin: 12px 0;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-answer {
  display: flex;
  align-items: center;
}
.question-answer div {
  margin: 0 10px;
}

.question-answers .question-answer {
  margin-top: 10px;
}
.question-answers .question-answer:last-child {
  margin-top: 15px;
}

.question-title {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
}

@media (min-width: 960px) {
  .question-title {
    grid-template-columns: 1fr 300px;
  }
}
</style>