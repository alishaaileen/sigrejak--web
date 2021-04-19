import axios from 'axios'
import { API_URL } from '../../constants'
// import { getProfileKeluarga } from '../../utils'

const state = () => {
    return {
        id: null,
        nama_keluarga: null,
        username: null,
        email: null,
        nama_lingkungan_diketuai: null,
        token: localStorage.getItem('token') || null,
        status: null,
        tempIdForDetail: null,
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
    resetData() {
        state.id = null
        state.nama_keluarga = null
        state.username = null
        state.email = null
        state.nama_lingkungan_diketuai = null
    },
    setTempIdForDetail(state, id) {
        state.tempIdForDetail = id
    }
}

const actions = {
    async login({ commit }, user) {
        try {
            let response = await axios.post(`${API_URL}/login`, user)

            localStorage.setItem('token', response.data.token)
            commit('setToken', response.data.token);
            commit('setStatus', 'success');
        } catch (e) {
            console.error(e)
            commit('setStatus', 'error');
        }
    },
    async getProfileKeluarga({ commit, state }) {
        const config = {
            headers: { Authorization: `Bearer ${state.token}` }
        };
        
        const bodyParameters = {
           key: "value"
        };

        try {
            let response = await axios.get(`${API_URL}/keluarga/profile`,bodyParameters, config)

            commit('setData', response.data.keluarga);

            return true
        } catch (e) {
            console.error(e)
            commit('setStatus', 'error');

            return false
        }
    },
    checkIfTokenExpired() {
        let headers = {
            'cache-control': 'no-cache'
        };
        let accessToken = localStorage.getItem('jwt-token');
    
        if (accessToken && accessToken !== '') {
            headers.Authorization = accessToken;
        }
        const instance = axios.create({
            baseURL: API_URL,
            headers: headers
        });
    
        instance.interceptors.response.use((response) => {
            if(response.status === 401) {
                 //add your code
                 alert("You are not authorized");
            }
            return response;
        }, (error) => {
            if (error.response && error.response.data) {
                 //add your code
                 return Promise.reject(error.response.data);
            }
            return Promise.reject(error.message);
        });
    
        return instance;
    },
    logout({ commit }) {
        localStorage.removeItem('token')
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