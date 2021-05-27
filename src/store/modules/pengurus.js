import axios from 'axios'
import { API_URL } from '../../constants'
// import { checkUserToken } from '../../utils'

const state = () => {
    return {
        id: null,
        nama: null,
        email: null,
        role: null,
        no_telp: null,
        appKey: localStorage.getItem('appKey') || null,
        status: null,
    }
}

const getters = {
    isAuthenticated: state => !!state.appKey,
    authStatus: state => state.status,
}

const mutations = {
    setData(state, pengurus) {
        state.id = pengurus.id
        state.nama = pengurus.nama
        state.email = pengurus.email
        state.role = pengurus.role
        state.no_telp = pengurus.no_telp
    },
    setStatus(state, status) {
        state.status = status
    },
    setToken(state, appKey) {
        state.appKey = appKey
    },
    resetData() {
        state.id = null
        state.nama = null
        state.email = null
        state.role = null
    }
}

const actions = {
    async login({ commit }, login) {
        localStorage.setItem('appKey', login.token)
        commit('setToken', login.token);
        commit('setStatus', 'success');
    },
    async checkUserToken({ commit, state }) {
        const config = { headers: { Authorization: `Bearer ${state.appKey}` } };
        const bodyParameters = { key: "value" };

        try {
            let response = await axios.get(`${API_URL}/check-user`,bodyParameters, config)
            commit('setData', response.data);

            return true
        } catch (e) {
            console.error(e)
            commit('setStatus', 'error');

            return false
        }
    },
    async getPengurusProfile({ commit, state }) {
        const config = { headers: { Authorization: `Bearer ${state.appKey}` } };
        const bodyParameters = { key: "value" };

        try {
            let response = await axios.get(`${API_URL}/admin/${state.id}`,bodyParameters, config)
            commit('setData', response.data.result[0]);

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
        let accessToken = localStorage.getItem('jwt-appKey');
    
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
        localStorage.removeItem('appKey')
        commit('resetData')
        console.log(localStorage.getItem('appKey'))
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}