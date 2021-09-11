import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: false,
        default: 'light',
        themes: {
            light: {
                primary: '#1F306E',
                secondary: '#553772',
                tertiary: '#8F3B76',
                accent: '#8F3B76',
                systembar: '#22357C',
                error: '#F1416C',
                info: '#009EF7',
                success: '#50CD89',
                warning: '#FFC700',

            },
            dark: {
                // primary: '#13284c',
                // secondary: '#066ca9',
                // accent: '#82B1FF',
                // error: '#FF5252',
                // info: '#2196F3',
                // success: '#4CAF50',
                // warning: '#FB8C00',
            },
        },
    },
});
