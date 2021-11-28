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
    const publishOriginal = window.mqtt.publish

    window.mqtt.publishAll = () => {
      setTimeout(() => {
        if (Object.keys(window.mqtt.queue || {}).length > 0) {
          Object.values(window.mqtt.queue).forEach(args => {
            publishOriginal.call(window.mqtt, ...args)
          })
          window.mqtt.queue = {}
        }
      }, 200)
      
    }
    window.mqtt.publish = (topic, payload, options, callback) => {
      if (typeof options === 'function') {
        callback = options
        options = null
      }
      if (typeof payload === 'object') {
        payload = JSON.stringify(payload)
      }

      if (window.mqtt.connected) {
        return publishOriginal.call(window.mqtt, topic, payload, options, callback)
      } else {
        if (!window.mqtt.queue) {
          window.mqtt.queue = {}
        }
        window.mqtt.queue[topic] = [topic, payload, options, callback]
        return false
      }
      
    }

    // window.mqtt.publish = (...args) => {
    //   if (window.mqtt.connected) {
    //     console.log(...args)

    //     const newArgs = Array(4).fill({}).forEach((_, i) => i < args.length ? args[i] : undefined)

    //     return publishOriginal(...newArgs)
    //   } else {
    //     const data = JSON.parse(args[1])
    //     if (!window.mqtt.queue) {
    //       window.mqtt.queue = {}
    //     }
    //     window.mqtt.queue[data.action] = args
    //   }
      
    // }
    window.mqtt.on('connect', () => {
      console.log(
        '%cmqtt connected', 
        ` text-transform:uppercase; 
          background: orange; color:#fff;
          border-radius: 5px;
          padding: 2px 5px;
        `
      )
      window.mqtt.publishAll();
    })



    window.mqtt.on('message', (topic, message) => {
      const data = JSON.parse(message.toString())
      console.log('MESSAGE ' + data.content, topic, message)
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