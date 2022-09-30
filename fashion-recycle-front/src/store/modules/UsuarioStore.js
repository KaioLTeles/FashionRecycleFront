import Vue from 'vue'
import Vuex from 'vuex'
import { API } from '@/api/config'

import { UsuarioApi } from '@/api/UsuarioApi'

import {
    AUTENTICAR,
    RESETA_SENHA_USUARIO,
    ENVIA_CHAVE_ACESSO,
    VERIFICA_CHAVE_ACESSO,
    INSERE_MATRICULA,
    ESQUECI_MINHA_SENHA,
    RESET_STATE_USUARIO,
    SAIR,
    VERIFICAR_EXISTE_MATRICULA,
    VALIDA_DADOS_USUARIO_CORPORE,
    RETORNAR_USUARIOS,
    SET_SESSION_EXPIRED,
    GET_SESSION_EXPIRED,
    GET_USUARIO_SOLICITANTE_RA,
    GET_USUARIO_RESPONSAVEL_RA,
    GET_USUARIOS_ATIVOS_SEM_EQUIPAMENTOS_BY_SISTEMA,
    BUSCAR_USUARIOS_POR_PAPEL,
    BUSCAR_USUARIOS_ATIVOS_RM,
    BUSCAR_TODOS_USUARIOS,
    GET_PAPEIS_VENDEDORES,
    ESQUECI_MINHA_SENHA_ROUTE,
    ESQUECI_MINHA_SENHA_MATRICULA_EMAIL,
    GET_PAPEIS_SUPERVISORES_BY_ORGANIZACAO,
    BUSCARTODOSOSUSUARIOS,
    BUSCARUSERPELOID,
    EMPTYUSER,
    CRIARUSUARIO,
    ALTERARUSUARIO
} from '@/store/types/UsuarioType'

// import { RESET_STATE_APROVACAO } from '@/store/types/AprovacaoType'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        usuario: {           
            token: '',                        
            email: ''
        },
        Autenticado: false,
        PapelUsuario: 0,
        matricula: '',
        codigoRetorno: '',
        descricaoRetorno: '',
        listaUsuarios: [],
        sessionExpired: false,
        usuarioSap: '',
        senhaSap: '',
        listaUsuarioRAResult: [],
        listaUsuarioResponsavelRAResult: [],
        usuariosAtivosSemEquipamentosBySistema: [],
        getPapeisVendedoresListDt: [],
        esqueciMinhaSenhaRouteResponse: null,
        esqueciMinhaSenhaMatriculaEmail: null,
        supervisoresPorOrganizacao: [],
        listaTodosOsUsuarios: [],
        usuarioObj: {}
    }
}

const state = getDefaultState()

const getters = {}

const mutations = {
    [AUTENTICAR](state, response) {              
        state.usuario.token = response.token        
        state.usuario.email = response.email
        state.Autenticado = true
        state.PapelUsuario = response.roleUser

        API.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
    },
    [INSERE_MATRICULA](state, matricula) {
        state.matricula = matricula
    },
    [RESET_STATE_USUARIO](state) {
        state.listaUsuarioPapel = []
        state.listaUsuarios = []
        state.filtro = { matricula: '', nome: '', situacao: '', email: '' }
        state.listaUsuarioSistemas = []
        state.listaHistoricoPapeis = []
    },
    [SAIR](state) {
        state.usuario = {}
        state.Autenticado = false
        state.PapelUsuario = 0
        API.defaults.headers.common['Authorization'] = null
    },
    [RETORNAR_USUARIOS](state, listaUsuarios) {
        state.listaUsuarios = listaUsuarios
    },
    [SET_SESSION_EXPIRED](state, payload) {
        state.sessionExpired = payload
    },
    [GET_USUARIO_SOLICITANTE_RA](state, response) {
        state.listaUsuarioRAResult = response
    },
    [GET_USUARIO_RESPONSAVEL_RA](state, response) {
        state.listaUsuarioResponsavelRAResult = response
    },
    [GET_USUARIOS_ATIVOS_SEM_EQUIPAMENTOS_BY_SISTEMA](state, response) {
        state.usuariosAtivosSemEquipamentosBySistema = response
    },
    [GET_PAPEIS_VENDEDORES](state, response) {
        state.getPapeisVendedoresListDt = response
    },
    [ESQUECI_MINHA_SENHA_ROUTE](state, response) {
        state.esqueciMinhaSenhaRouteResponse = response
    },
    [ESQUECI_MINHA_SENHA_MATRICULA_EMAIL](state, response) {
        state.esqueciMinhaSenhaMatriculaEmail = response
    },
    [GET_PAPEIS_SUPERVISORES_BY_ORGANIZACAO](state, response) {
        state.supervisoresPorOrganizacao = response
    },
    [BUSCARTODOSOSUSUARIOS](state, response) {
        state.listaTodosOsUsuarios = response
    },
    [BUSCARUSERPELOID](state, response) {
        state.usuarioObj = response
    },
    [EMPTYUSER](state) {
        state.usuarioObj = {}
    }
}

const actions = {
    async [AUTENTICAR]({ commit }, payload) {
        return UsuarioApi.autenticar(payload.username, payload.password).then(response => {
            if (response.data.token != "") {
                console.log("entrou no if")
                localStorage.setItem('usuario', JSON.stringify(response.data))
                commit(AUTENTICAR, response.data)
            }
            return response.data
        })
    },
    async [RESETA_SENHA_USUARIO](context, codigoUsuario) {
        return UsuarioApi.resetaSenhaUsuario(codigoUsuario).then(response => {
            return response.data
        })
    },
    async [ENVIA_CHAVE_ACESSO](context, matricula) {
        return UsuarioApi.enviaEmailChaveAcesso(matricula).then(response => {
            return response.data
        })
    },
    async [VERIFICA_CHAVE_ACESSO](context, payload) {
        return UsuarioApi.verificaChaveAcesso(payload).then(response => {
            return response.data
        })
    },
    async [ESQUECI_MINHA_SENHA](context, payload) {
        return UsuarioApi.esqueciMinhaSenha(payload).then(response => {
            return response.data
        })
    },
    async [SAIR]({ commit }) {
        localStorage.removeItem('usuario')
        commit(SAIR)
    },
    async [VERIFICAR_EXISTE_MATRICULA](context, payload) {
        return UsuarioApi.verificaExisteMatricula(payload).then(response => {
            return response.data
        })
    },
    async [VALIDA_DADOS_USUARIO_CORPORE](context, payload) {
        return UsuarioApi.validaDadosUsuarioCorpore(payload).then(response => {
            return response.data
        })
    },
    async [RETORNAR_USUARIOS]({ commit }, nome) {
        return UsuarioApi.retornaUsuarios(nome).then(response => {
            commit(RETORNAR_USUARIOS, response.data)
        })
    },
    async [SET_SESSION_EXPIRED]({ commit }, payload) {
        commit(SET_SESSION_EXPIRED, payload)
    },
    async [GET_SESSION_EXPIRED]() {
        return state.sessionExpired
    },
    async [GET_USUARIO_SOLICITANTE_RA](context, payload) {
        return UsuarioApi.getUsuarioSolicitanteRA(payload).then(response => {
            context.commit(GET_USUARIO_SOLICITANTE_RA, response.data)
        })
    },
    async [GET_USUARIO_RESPONSAVEL_RA](context, payload) {
        return UsuarioApi.getUsuarioResponsavelRA(payload).then(response => {
            context.commit(GET_USUARIO_RESPONSAVEL_RA, response.data)
        })
    },
    async [GET_USUARIOS_ATIVOS_SEM_EQUIPAMENTOS_BY_SISTEMA]({ commit }) {
        return UsuarioApi.getUsuariosAtivosSemEquipamentosBySistema().then(response => {
            commit(GET_USUARIOS_ATIVOS_SEM_EQUIPAMENTOS_BY_SISTEMA, response.data)
        })
    },
    async [BUSCAR_USUARIOS_POR_PAPEL](context, matricula) {
        return UsuarioApi.buscarUsuariosPorPapel(matricula).then(response => {
            return response.data
        })
    },
    async [BUSCAR_USUARIOS_ATIVOS_RM]() {
        return UsuarioApi.buscarUsuariosAtivosRM().then(response => {
            return response.data
        })
    },
    async [BUSCAR_TODOS_USUARIOS]() {
        return UsuarioApi.buscarTodosUsuarios().then(response => {
            return response.data
        })
    },
    async [GET_PAPEIS_VENDEDORES](context, payload) {
        return UsuarioApi.getPapeisVendedores(payload).then(response => {
            context.commit(GET_PAPEIS_VENDEDORES, response.data)
        })
    },
    async [ESQUECI_MINHA_SENHA_ROUTE](context, payload) {
        return UsuarioApi.esqueciMinhaSenhaRoute(payload).then(response => {
            context.commit(ESQUECI_MINHA_SENHA_ROUTE, response.data)
        })
    },
    async [ESQUECI_MINHA_SENHA_MATRICULA_EMAIL](context, payload) {
        return UsuarioApi.esqueciMinhaSenhaMatriculaEmail(payload).then(response => {
            context.commit(ESQUECI_MINHA_SENHA_MATRICULA_EMAIL, response.data)
        })
    },
    async [GET_PAPEIS_SUPERVISORES_BY_ORGANIZACAO](context, payload) {
        return UsuarioApi.getPapeisSupervisoresByOrganizacao(payload).then(response => {
            context.commit(GET_PAPEIS_SUPERVISORES_BY_ORGANIZACAO, response.data)
        })
    },
    async [BUSCARTODOSOSUSUARIOS](context, payload) {
        return UsuarioApi.buscaTodosUsuarios(payload).then(response => {
            context.commit(BUSCARTODOSOSUSUARIOS, response.data)
        })
    },
    async [BUSCARUSERPELOID](context, payload) {
        return UsuarioApi.buscarUsuarioPeloId(payload).then(response => {
            context.commit(BUSCARUSERPELOID, response.data)
        })
    },    
    async [CRIARUSUARIO](context, payload) {
        console.log(payload)
        return UsuarioApi.criarUsuario(payload).then(() => {
        })
    },    
    async [ALTERARUSUARIO](context, payload) {
        console.log(payload)
        return UsuarioApi.alterarUsuario(payload).then(() => {
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
