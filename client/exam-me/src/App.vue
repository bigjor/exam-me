<template>
  <v-app>
    <transition name="fade" mode="out-in">
      <router-view class="child-view"></router-view>
    </transition>

    <base-prompt/>
  </v-app>
</template>

<script>
import mqtt from 'mqtt';
import { mapActions } from 'vuex';

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
  methods: {
    ...mapActions({
      setRooms: 'rooms/setRooms',
      setRoom: 'rooms/setRoom',
    })
  },

  created() {
    const pj = require('../package.json')
    const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
    window.mqtt = mqtt.connect(pj.mqtt.url, { clientId, clean: true })
    window.mqtt.on('connect', () => {
      console.log(
        '%cmqtt connected', 
        ` text-transform:uppercase; 
          background: orange; color:#fff;
          border-radius: 5px;
          padding: 2px 5px;
        `
      )
    })
    window.mqtt.on('message', (topic, message) => {
      const data = JSON.parse(message.toString())
      console.log('MESSAGE ' + data.content)
      if (data.content == 'rooms') {
        this.setRooms(data.rooms)
      } else if (data.content == 'room') {
        this.setRoom(data.room)
      }
    })
  }
};
</script>

<style src="@/styles.css"></style>