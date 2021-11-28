<template>
  <v-main class="background-app dashboard-view">
    <div class="logo">
      <p class="logo-text small">Exam-me</p>
    </div>

    <v-container>
      <div class="exam-title">
        <div class="card-header">
          <div class="card-title">
            <div class="card-info" :class="{ 'active': exam.active }"></div>
            <div class="card-info-description">{{ exam.title }}</div>
          </div>
          <div class="card-title">
            <div class="card-info-description" v-time-left="exam.end_date"></div>
          </div>
        </div>
      </div>
      <div class="exam-info">

        <form id="form-pruebas" action="" enctype="multipart/form-data" novalidate >
          <div id="pruebas" style="width: 200px; height: 200px; background: red"></div>

        </form>

      </div>
      <div class="exam-files">
        <v-treeview
          v-model="files.tree"
          :open="files.initiallyOpen"
          :items="files.items"
          activatable
          item-key="name"
          open-on-click
        >
          <template v-slot:prepend="{ item, open }">
            <v-icon v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else>
              {{ files.files[item.file] }}
            </v-icon>
          </template>
        </v-treeview>
      </div>
      <div class="exam-sheet">
        
      </div>
    </v-container>

  </v-main>
</template>

<script>
import { exam_type, exam_sheet } from '../../../exam_templates/exam_writed'
import Axios from 'axios'

export default {
  name: 'Exam',
  data() {
    return {
      exam_type,
      exam: exam_sheet,
      percentPromises: {},
      upload: 0,
      files: {
        initiallyOpen: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      tree: [],
      items: [
        {
          name: '.git',
        },
        {
          name: 'node_modules',
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [{
                name: 'logo.png',
                file: 'png',
              }],
            },
            {
              name: 'favicon.ico',
              file: 'png',
            },
            {
              name: 'index.html',
              file: 'html',
            },
          ],
        },
        {
          name: '.gitignore',
          file: 'txt',
        },
        {
          name: 'babel.config.js',
          file: 'js',
        },
        {
          name: 'package.json',
          file: 'json',
        },
        {
          name: 'README.md',
          file: 'md',
        },
        {
          name: 'vue.config.js',
          file: 'js',
        },
        {
          name: 'yarn.lock',
          file: 'txt',
        },
      ],
      }
    }
  },
  methods: {
    readFile(file) {
      return new Promise(resolve => {
        const reader = new FileReader() 
        reader.onload = function () {
          try {
            let arrayBuffer = this.result,
                array = new Uint8Array(arrayBuffer),
                binaryString = String.fromCharCode.apply(null, array);
      
            resolve(binaryString)
          } catch (err) {
            reader.onload = function () {
              resolve(this.result)
            }
            reader.readAsText(file)

          }
        }
        reader.readAsArrayBuffer(file)

      })
    },
    // read file as bytes
    updateProcess() {
      const values = Object.values(this.percentPromises)
      if (!values.length) return
      this.upload = Math.floor(values.reduce((a, b) => a + b, 0) / values.length)
      console.log(this.upload)
    },
    sendFile(path, file) {
      // console.log("envio")
      this.percentPromises[path] = 0
      var formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)
      formData.append('id', this.exam.id)
      return Axios.post('http://localhost:9999/files', formData, {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        onUploadProgress: (progressEvent) => {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.percentPromises[path] = percentCompleted
          this.updateProcess()
        }
      })
        .then(response => {
          this.percentPromises[path] = 100
          this.updateProcess()
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },

  },
  mounted() {
    
    setTimeout(() => {

      let files = new Map()

      const iterateTree = (entry, path = '') => {
        return new Promise(resolve => {
          if (entry.isFile) {
            entry.file(async file => {
              //const bytes = await this.readFile(file)
              files.set(path + file.name, file);
              resolve();
            });
          } else if (entry.isDirectory) {
            const dir = entry, dirReader = dir.createReader();
            dirReader.readEntries(entries => {
              Promise.all(entries.map(entry => iterateTree(entry, `${path}${dir.name}/`))).then(() => {
                resolve();
              });
            });
          }
        });
      }

      for (let event of ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']) {
        document.querySelector('body').addEventListener(event, e => {
          e.preventDefault()
          e.stopPropagation()

          if (event == 'drop') {
            this.percentPromises = {}
            files = new Map()
            const { items } = e.dataTransfer;
            for (const item of items) {
              // webkitGetAsEntry is where the magic happens
            
              const entry = item.webkitGetAsEntry();
              if (entry) {
                iterateTree(entry).then(() => {
                  files.forEach((file, path) => {
                    this.sendFile(path, file)
                  })
                  
                });
              } 
              
            }
          }

        })

      }
      


    }, 1000)
  },
}
</script>

<style>

.exam-sheet, .exam-title, .exam-info, .exam-files {
  padding: 24px;
  background-color: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-bottom: 12px;
}

</style>