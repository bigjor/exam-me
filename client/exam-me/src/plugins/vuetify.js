import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#B219E5',
                secondary: '#D787F1',
                third: '#342C5B',
                accent: '#545C94',
                light_accent: '#8690AF',
                background: '#1C0424',
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
