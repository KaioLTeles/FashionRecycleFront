import Vue from 'vue'
import Vuex from 'vuex'
import UsuarioStore from './modules/UsuarioStore'
import NotificationStore from './modules/NotificationStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        UsuarioStore,
        NotificationStore       
    }
})
