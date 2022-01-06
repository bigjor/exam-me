<template>
  <div class="room">
    <v-container>
      <div class="header">
        <div>
          <v-btn
            icon
            color="var(--third)"
            @click="goBack()"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          Room {{ getCode() }}
        </div>
        <v-tabs
          class="room-tabs"
          fixed-tabs
          v-model="tab"
          background-color="var(--background)"
          dark
        >
          <v-tab :to="{ name: 'Exams' }">
            Examenes
          </v-tab>
          <v-tab :to="{ name: 'Review' }">
            Revision
          </v-tab>
          <v-tab :to="{ name: 'Results' }">
            Resultados
          </v-tab>
        </v-tabs>
      </div>
    </v-container>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'exam',
  props: {
    roomId: String
  },
  data () {
    return {
      tab: null,
      exam: {
        loading: true,
      },
      exams: []
    }
  },
  methods: {
    getCode () {
      return this.room?.code || ''
    },
    goBack() {
      const matched = this.$route.matched
      const currentPath = this.$route.path
      const dataPath = currentPath.split('/')

      console.log(this.$route, this.$router)
      switch (matched[matched.length - 1].path) {
        case '/admin/room/:roomId/exam/:examId':
        case '/admin/room/:roomId/exam':
          this.$router.push({ 
            path: `/admin/room/${dataPath[3]}/exams`
          })
          break
        case '/admin/room/:roomId':
          this.$router.push({ 
            path: '/admin/rooms' 
          })
          break
        case '/admin/room/:roomId/exams':
        case '/admin/room/:roomId/review':
        case '/admin/room/:roomId/results':
          this.$router.push({ 
            path: `/admin/room/${dataPath[3]}`
          })
          break
        default:
          this.$router.go(-1)
          break
      }
    }
  },
  computed: {
    ...mapGetters({
      room: 'rooms/getRoom',
    }),
    ...mapActions('rooms', {
      unsetRoom: 'unsetRoom',
    }),
  },
  mounted() {
    window.mqtt.publish(`/`, {
      action: 'room/details',
      inject: ['access'],
      body: {
        _id: this.roomId,
      }
    })
  },
  beforeDestroy() {
    this.unsetRoom()
  }

}
</script>

<style scoped>
.room .header {
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

.room .content .exam-card {
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

.room .content .create-card {
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
}

.room .content .create-card div {
  margin: 8px;
}

.room .room-tabs {
  border-radius: 10px;
}
</style>