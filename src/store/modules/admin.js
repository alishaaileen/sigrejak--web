import axios from 'axios'
import { API_URL } from '../../constants'
// import { getProfileKeluarga } from '../../utils'

const state = () => {
    return {
        id: null,
        nama: null,
        email: null,
        role: null,
        token: localStorage.getItem('token') || null,
        status: null,
    }
}

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
}

const mutations = {
    setData(state, admin) {
        state.id = admin.id
        state.nama = admin.nama
        state.email = admin.email
        state.role = admin.role
    },
    setStatus(state, status) {
        state.status = status
    },
    setToken(state, token) {
        state.token = token
    },
    resetData() {
        state.id = null
        state.nama = null
        state.email = null
        state.role = null
    }
}

const actions = {
    async login({ commit }, admin) {
        try {
            let response = await axios.post(`${API_URL}/login-admin`, admin)

            localStorage.setItem('token', response.data.token)
            commit('setToken', response.data.admin.token);
            commit('setData', response.data.admin);
            commit('setStatus', 'success');
            
            return response.status
        } catch (e) {
            console.error(e)
            commit('setStatus', 'error');
            
            return e.response.status
        }
    },
    async getProfileAdmin({ commit, state }) {
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