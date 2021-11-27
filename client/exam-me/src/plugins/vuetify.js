import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0A0B39',
        secondary: '#1C0424',
        third: '#454266',
        accent: '#535D92',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        reading: '#FFA32E',
        warning: '#FFC107',
        legend_error: '#f5c6cb',
        legend_warn: '#ffeeba',
        legend_info: '#d1e7f5',
        legend_success: '#c3e6cb',
        white: '#ffffff',
        black: '#000000'
      }
    }
  }
});
