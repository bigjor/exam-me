<template>
  <v-container class="rooms">
    <div class="header">
      <div>Rooms</div>
    </div>

    <div class="content" v-grid>
      <div class="room-card create-card" @click="createRoom()">
        <div>
          <v-icon x-large color="#555">mdi-plus</v-icon>
        </div>
        <div> Create room </div>
      </div>
      <div class="room-card" v-for="(room, key) in rooms || []" :key="key" @click="openRoom(room)">
        <div class="card-header">
          <div class="card-title">
            <div class="card-info" :class="{ 'active': room.active }"></div>
            <div class="card-info-description">{{ room.name }}</div>
          </div>
          <div class="card-status" @click.stop="toggleStatusRoom(room)">
            <v-icon color="#ED3C24">mdi-power</v-icon>
          </div>
        </div>

        <div class="card-content">
          <div class="card-row">
            <div class="card-row-left">Code:</div>
            <div class="card-row-right">{{ room.code }}</div>
          </div> 
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'rooms',
  computed: {
    ...mapGetters({
      rooms: 'rooms/getRooms'
    })
  },
  methods: {
    async createRoom() {
      // TODO: Mostrar dialogo
      let name = await this.$examme.PROMPT.show({
        title: 'Enter the room name',
        label: 'Room name',
      })
      if (!name) return

      const access = localStorage.getItem('exam-me-access') 
      window.mqtt.publish(`examme/${access}`, JSON.stringify({
        action: 'room/create',
        body: {
          name,
          timestamp: new Date().getTime()
        }
      }))
    },
    toggleStatusRoom(room) {
      const access = localStorage.getItem('exam-me-access')
      room.active = !room.active
      window.mqtt.publish(`examme/${access}`, JSON.stringify({
        action: 'room/update',
        body: room
      }))
    },
    openRoom(room) {
      this.$router.push({
        path: `room/${room._id}`
      })
    },
  }
}
</script>

<style scoped>
.rooms .header {
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

.rooms .content .room-card {
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

.rooms .content .create-card {
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase;
}

.rooms .content .create-card div {
  margin: 8px;
}

</style>