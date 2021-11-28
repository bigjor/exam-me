<template>
  <div>
    <v-dialog
      v-model="prompt.opened"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ prompt.title || 'Prompt' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="prompt.value"
            :label="prompt.label"
            filled
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            text
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary darken-1"
            text
            @click="accept"
          >
            Accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'base-prompt',
  methods: {
    cancel() { 
      this.prompt.status = false;
      this.prompt.resolve();
    },
    accept() {
      this.prompt.status = true;
      this.prompt.resolve();
    }
  },
  computed: {
    ...mapState({
      prompt: state => state.dialogs.prompt,
    }),
  },
  mounted() {
    window.promptComponent = this;
  },
}
</script>

<style>

</style>