<template>
  <v-main class="background-app admin-view">
    <div class="logo">
      <p class="logo-text small">Exam-me</p>
    </div>

    <router-view></router-view>
  </v-main>
</template>

<script>
import { Rooms, Access } from '../../services/api'

export default {
  name: 'admin',
  methods: {
    async check() {
      try {
        const code = localStorage.getItem('exam-me-code')
        const res = await Rooms.get(code)
        if (res.data._id != 'admin') throw Error('No admin')
        
        const access = localStorage.getItem('exam-me-access')
        if (!access) {
          let resAccess = await Access.get({ admin: true })
          localStorage.setItem('exam-me-access', resAccess.data._id)
          window.mqtt.subscribe(`examme/${resAccess.data._id}`, { qos: 1 })
        } else {
          await Access.update({ admin: true })
          window.mqtt.subscribe(`examme/${access}`, { qos: 1 })
        }
      } catch (_) {
        this.$router.replace('/')
      }
    }
  },
  mounted() {
    this.check()
  },
}
</script>

<style scoped>


</style>