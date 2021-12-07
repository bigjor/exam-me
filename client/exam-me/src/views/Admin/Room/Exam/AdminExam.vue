<template>
  <div class="exam">
    <v-container>
      <div class="content">
        <v-form
          ref="exam_form"
          v-model="valid"
          lazy-validation
        >

          <div v-for="(obj, index) of exam_template" :key="`obj-${index}`" :class="{ 'header-style': obj.style == 'header' }">
            <div class="exam-row" v-grid v-grid-auto-rows v-if="obj.type == 'group'">
              <div v-for="(item_grp, index_grp) of obj.children" :key="`item-grp-${index}-${index_grp}`">
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

              <div class="question-answers">

              </div>
            </div>

            <v-divider v-if="index != (exam_template.length - 1)"></v-divider>
          </div>

          <v-row class="buttons">
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-btn
                block
                depressed
                color="primary"
                @click="addQuestion"
              >
                Add Question
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-btn
                block
                depressed
                color="secondary"
                @click="saveExam"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AdminExam',
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
      exam_template: [
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
  methods: {
    $t(arg) {
      return arg
    },
    addQuestion() {
      this.exam_template.push({
        title: undefined,
        question_type: 'text',
        type: 'question', // select, checkbox, radio, text, number, date, time, textarea
      })
    },
    removeQuestion(index) {
      this.exam_template.splice(index, 1)
    },
    saveExam() {
      this.$refs.exam_form.validate()
      if (this.valid) {
        console.log('valid')
      } else {
        console.log('invalid')
      }
    },
    getRulesString(args) {
      let rules = []
      if (args.length) {
        rules.push(v => v?.length <= args?.length || 'Characters overflowed')
      }
      return rules
    }
  }
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