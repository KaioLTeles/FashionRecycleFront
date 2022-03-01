import Vue from 'vue'
import Vuex from 'vuex'

import { SET_MESSAGE, SET_SNACKBAR_FALSE } from '@/store/types/NotificationType'

Vue.use(Vuex)

const state = () => ({
    snackbarShow: false,
    message: '',
    color: ''
})

const mutations = {
    [SET_MESSAGE](state, payload) {
        state.snackbarShow = true
        state.message = payload.message
        state.color = payload.color
    },
    [SET_SNACKBAR_FALSE](state) {
        state.snackbarShow = false
    }
}

const getters = {
    snackbarShow: state => {
        return state.snackbarShow
    }
}

const actions = {
    async [SET_MESSAGE]({ commit }, message) {
        commit(SET_SNACKBAR_FALSE)
        commit(SET_MESSAGE, message)
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
