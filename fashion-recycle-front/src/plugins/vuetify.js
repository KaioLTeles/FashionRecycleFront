import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@/sass/overrides.sass'
import { Ripple } from 'vuetify/lib/directives'
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import pt from '../locales/pt'

Vue.use(Vuetify, {
    directives: {
        Ripple
    }
})
const theme = {
    primary: '#1866c0',
    secondary: '#e3ecf9',
    accent: '#4693f8',
    background: '#2c698d', // maincolor: '#66BB6A'
    toolbarcolor: '#1866c0',
    sidebarcolor: '#1866c0',
    tabbackcolor: '#F5F5F5',
    statusbarcolor: '#2f3337',
    btnPrimary: '#2196f3',

    // Cores para Tipos de Pedido
    colorZOV: '#2196f3',
    colorZOB: '#2196f3',
    colorZBN: '#2196f3',
    colorZPDV: '#2196f3',
    colorZBR: '#2196f3',
    colorZEX: '#2196f3',

    // Tons de cinza
    disabledGrey: '#f3f3f4',

    colorVermelhoValor: '#500f0f'
}

export default new Vuetify({
    icons: {
        iconfont: 'fa'
    },
    theme: {
        dark: false,
        themes: {
            dark: theme,
            light: theme
        }
    },
    lang: {
        locales: { pt },
        current: 'pt'
    }
})
