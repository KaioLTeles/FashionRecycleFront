import { API } from './config'

const autenticar = async function(Username, Password) {    
    return API.post('/user/login', {
        Username,
        Password
    }).then(response => {
        return response
    })
}

const verificaExisteMatricula = async function(matricula) {
    return API.get('/usuario/verificaExisteMatricula', {
        params: {
            matricula: matricula
        }
    })
}

const resetaSenhaUsuario = async function(codigoUsuario) {
    return API.post(
        '/usuario/resetaSenhaUsuario',
        {
            codigo: codigoUsuario
        },
        {
            successHandle: true
        }
    )
}

const enviaEmailChaveAcesso = async function(matricula) {
    return API.post(
        '/usuario/enviaEmailChaveAcesso',
        {
            matricula: matricula
        },
        {
            successHandle: true
        }
    )
}

const verificaChaveAcesso = async function(payload) {
    return API.get(
        '/usuario/verificaChaveAcesso',
        {
            params: {
                chaveAcesso: payload.chaveAcesso,
                matricula: payload.matricula
            }
        },
        {
            successHandle: true
        }
    )
}

const esqueciMinhaSenha = async function(payload) {
    return API.post('/usuario/esqueciMinhaSenhaChangePasswordNew', {
        novaSenha: payload.senha,
        matricula: payload.matricula,
        chave: payload.chaveAcesso
    })
}

const esqueciMinhaSenhaRoute = async function(payload) {
    return API.post('/usuario/esqueciMinhaSenhaNewRoute', {
        matricula: payload.matricula,
        codigoUsuario: payload.codigoUsuario
    })
}

const esqueciMinhaSenhaMatriculaEmail = async function(payload) {
    return API.post('/usuario/esqueciMinhaSenhaMatriculaEmail', {
        matriculaEmail: payload.matriculaEmail
    })
}

const retornaUsuarios = async function(nome) {
    return API.post('/usuario/retornaUsuarios', {
        nome: nome
    })
}

const getUsuarioSolicitanteRA = async function(payload) {
    return API.get('/usuario/getUsuarioSolicitanteRA', {
        params: {
            relatorio: payload
        }
    })
}

const getUsuarioResponsavelRA = async function(payload) {
    return API.get('/usuario/getUsuarioResponsavelRA', {
        params: {
            solicitacao: payload
        }
    })
}
const getUsuariosAtivosSemEquipamentosBySistema = async function() {
    return API.get('/usuario/getUsuariosAtivosSemEquipamentosBySistema', {
        params: {
            sistema: 'S2',
            nome: '',
            perfil: ''
        }
    })
}

const buscarUsuariosPorPapel = async function(codigoSAP) {
    return API.get('/usuario/buscarUsuariosPorPapel', {
        params: {
            codigoSAP: codigoSAP
        }
    })
}

const buscarUsuariosAtivosRM = async function() {
    return API.get('/usuario/buscarUsuariosAtivosRM')
}

const buscarTodosUsuarios = async function() {
    return API.get('/usuario/buscarTodosUsuarios')
}

const getPapeisVendedores = async payload => {
    const params = { params: payload }
    const response = await API.get('/usuario/getPapeisVendedores', params)
    if (response.data == '') response.data = []
    return response
}

const getPapeisSupervisoresByOrganizacao = async payload => {
    const params = { params: payload }
    const response = await API.get('/usuario/getPapeisSupervisoresByOrganizacao', params)
    if (response.data == '') response.data = []
    return response
}

const getUsuariosPapeisByCodigoPapel = async codigoPapel => {
    const response = await API.get(`/usuario/getUsuariosPapeisByCodigoPapel?codigoPapel=${codigoPapel}`)
    return response
}

const GetComercialFilterOptionsByUsuario = async () => {
    const response = await API.get('/usuario/GetComercialFilterOptionsByUsuario')
    return response
}

const getPapeisByUsuarioComercial = async payload => {
    const params = { params: payload }
    const response = await API.get('/usuario/getPapeisByUsuarioComercial', params)
    return response
}

const insertUsuarioPapelFromComercial = async payload => {
    const response = await API.post('/usuario/insertUsuarioPapelFromComercial', payload)
    return response
}
const updateUsuarioPapelFromComercial = async payload => {
    const response = await API.put('/usuario/updateUsuarioPapelFromComercial', payload)
    return response
}
const deleteUsuarioPapelFromComercial = async payload => {
    const response = await API.delete('/usuario/deleteUsuarioPapelFromComercial', {
        data: payload
    })
    return response
}

const getUsuariosByOrganizacaoToBeAddedInPapel = async codigoPapel => {
    const response = await API.get(`/usuario/getUsuariosByOrganizacaoToBeAddedInPapel?codigoPapel=${codigoPapel}`)
    return response
}

const getUsuariosByOrganizacao = async organizacao => {
    return await API.get(`/usuario/getUsuariosByOrganizacao?organizacao=${organizacao}`)
}

export const UsuarioApi = {
    autenticar,
    verificaExisteMatricula,
    resetaSenhaUsuario,
    enviaEmailChaveAcesso,
    verificaChaveAcesso,
    esqueciMinhaSenha,
    retornaUsuarios,
    getUsuarioSolicitanteRA,
    getUsuarioResponsavelRA,
    getUsuariosAtivosSemEquipamentosBySistema,
    buscarUsuariosPorPapel,
    buscarUsuariosAtivosRM,
    buscarTodosUsuarios,
    getPapeisVendedores,
    esqueciMinhaSenhaRoute,
    esqueciMinhaSenhaMatriculaEmail,
    getUsuariosPapeisByCodigoPapel,
    GetComercialFilterOptionsByUsuario,
    getPapeisByUsuarioComercial,
    insertUsuarioPapelFromComercial,
    updateUsuarioPapelFromComercial,
    deleteUsuarioPapelFromComercial,
    getUsuariosByOrganizacaoToBeAddedInPapel,
    getUsuariosByOrganizacao,
    getPapeisSupervisoresByOrganizacao
}
