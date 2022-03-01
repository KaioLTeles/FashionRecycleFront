import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

import axios from 'axios'
import jwtDecode from 'jwt-decode'

// Route
import route from '@/router'
import mainRoutes from '@/router/main'

// Store
import store from '@/store'
import { SET_MESSAGE } from '@/store/types/NotificationType'
import { SAIR, SET_SESSION_EXPIRED } from '@/store/types/UsuarioType'

const API = axios.create({
    baseURL: process.env.VUE_APP_API_URL
})

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

const errorHandler = error => {
    let payload = null

    if (error.config.errorHandle && error.config.errorHandle === false) {
        return Promise.reject(error)
    }

    if (error.message == 'Network Error') {
        payload = {
            message: 'Erro de rede, favor, contate o administrador',
            color: 'error'
        }
    } else if (error.response.status == 400) {
        payload = {
            message: error.response.data,
            color: 'error'
        }
    } else if (error.response.status == 500) {
        payload = {
            message: 'Erro no servidor, favor, contate o administrador',
            color: 'error'
        }
    } else if (error.response.status == 403) {
        payload = {
            message: 'Sem autorização para esse recurso',
            color: 'error'
        }
    } else if (error.response.status == 401) {
        payload = {
            message: 'Sessão expirada',
            color: 'error'
        }
        store.commit(SAIR)
        route.push(mainRoutes.login.path)
    }

    store.commit(SET_MESSAGE, payload)
    NProgress.done()
    return Promise.reject({ ...error })
}

const successHandler = response => {
    let payload = null

    if (response.config.successHandle && response.config.successHandle === true) {
        if (response.status == 200) {
            payload = { message: response.data, color: 'success' }
            store.commit(SET_MESSAGE, payload)
        }
        NProgress.done()
        return response
    }
    NProgress.done()
    return Promise.resolve(response)
}

API.interceptors.response.use(
    response => successHandler(response),
    error => errorHandler(error)
)

API.interceptors.request.use(
    function(config) {
        if (!tokenValid()) {
            store.commit(SAIR)
            route.push(mainRoutes.login.path)
        }

        // Do something before request is sent
        NProgress.start()
        return config
    },
    function(error) {
        // Do something with request error
        console.error(error)
        return Promise.reject(error)
    }
)

function tokenValid() {
    const usuarioStr = localStorage.getItem('usuario')
    if (usuarioStr === null) return true
    if (!usuarioStr) return false

    const usuario = JSON.parse(usuarioStr)

    if (!usuario.token) return false

    const decodedToken = jwtDecode(usuario.token)
    //console.log(decodedToken)

    if (Date.now() >= decodedToken.exp * 1000) {
        store.dispatch(SET_SESSION_EXPIRED, true)
        return false
    }

    return true
}

export { API }

export default API
