import Axios from 'axios'
import { API_URL } from '../../constants'

const state = () => {
    return {
        id: null,
        nama_keluarga: null,
        username: null,
        email: null,
        nama_lingkungan_diketuai: null,
        token: localStorage.getItem('keluarga-token') || null,
        status: null,
    }
}

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
}

const mutations = {
    setData(state, keluarga) {
        state.id = keluarga.id
        state.nama_keluarga = keluarga.nama_keluarga
        state.username = keluarga.username
        state.email = keluarga.email
        state.nama_lingkungan_diketuai = keluarga.nama_lingkungan_diketuai
    },
    setStatus(state, status) {
        state.status = status
    },
    setToken(state, token) {
        state.token = token
    },
    resetData(state) {
        state.id = null
        state.nama_keluarga = null
        state.username = null
        state.email = null
        state.nama_lingkungan_diketuai = null
    }
}

const actions = {
    async login({ commit }, user) {
        try {
            let response = await Axios.post(`${API_URL}/login`, user)

            localStorage.setItem('keluarga-token', response.data.token)
            commit("setToken", response.data.token);
            commit("setStatus", 'success');

            return true
        } catch (e) {
            console.error(e)
            commit("setStatus", 'error');

            return false
        }
    },
    logout({ commit }) {
        localStorage.removeItem('keluarga-token')
        commit('resetData')
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}