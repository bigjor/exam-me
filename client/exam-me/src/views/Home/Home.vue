<template>
  <v-main class="main-centered background-app home-view">
    <div class="logo">
      <p class="logo-text">Exam-me</p>
    </div>

    <div class="form-access">
      <v-container>
        <v-form>
          <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="code"
                :counter="8"
                label="Code"
                filled
                clearable
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-form>
      </v-container>
    </div>
  </v-main>
</template>

<script>
import { Rooms, Access } from '../../services/api'
export default {
  name: "home",
  data() {
    return {
      code: ''
    }
  },
  watch: {
    code: async function () {
      const { code } = this
      // CHECK CODE
      if (code.length >= 8) {
        localStorage.setItem('exam-me-code', code)
        this.$router.replace({ name: 'Dashboard', params: { code } })


        let res = await Rooms.get(code)
        localStorage.setItem('exam-me-code', code)

        let resAccess = await Access.get({ admin: res.data._id == 'admin' })
        localStorage.setItem('exam-me-access', resAccess.data._id)
        window.mqtt.subscribe(`examme/${resAccess.data._id}`, { qos: 1 })

        if (res.data._id === 'admin') {
          this.$router.replace({ path: '/admin' })
        } else if (res.data.ok) {
          this.$router.replace({ path: '/dashboard' })
        }
            
          
      }
    }
  }
}
</script>

<style>

.home-view .v-input__slot {
  background: #fff !important;
}


</style>