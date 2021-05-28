import axios from 'axios'
import { API_URL } from '../../constants'
// import { checkUserToken } from '../../utils'

const state = () => {
    return {
        id: null,
        nama_keluarga: null,
        nama_kepala_keluarga: null,
        no_telp_kepala_keluarga: null,
        username: null,
        email: null,
        lingkunganId: null,
        appKey: localStorage.getItem('appKey') || null,
        status: null,
    }
}

const getters = {
    isAuthenticated: state => !!state.appKey,
    authStatus: state => state.status,
}

const mutations = {
    setData(state, keluarga) {
        state.id = keluarga.id
        state.nama_keluarga = keluarga.nama_keluarga
        state.nama_kepala_keluarga = keluarga.nama_kepala_keluarga
        state.no_telp_kepala_keluarga = keluarga.no_telp_kepala_keluarga
        state.username = keluarga.username
        state.email = keluarga.email
    },
    setLingkunganId(state, id) {
        state.lingkunganId = id
    },
    setStatus(state, status) {
        state.status = status
    },
    setToken(state, appKey) {
        state.appKey = appKey
    },
    resetData() {
        state.id = null
        state.nama_keluarga = null
        state.username = null
        state.email = null
        state.nama_lingkungan_diketuai = null
        state.lingkunganId = null
    },
}

const actions = {
    async login({ commit }, login) {
        localStorage.setItem('appKey', login.token)
        commit('setToken', login.token);
        commit('setStatus', 'success');
    },
    async checkUserToken({ commit }) {
        // const config = { headers: { Authorization: `Bearer ${state.appKey}` } };
        // const bodyParameters = { key: "value" };

        try {
            let response = await axios.get(`${API_URL}/check-user`)
            commit('setData', response.data);

            return true
        } catch (e) {
            console.error(e)
            commit('setStatus', 'error');

            return false
        }
    },
    async getUserProfile({commit, state}) {
        // const config = { headers: { Authorization: `Bearer ${state.appKey}` } };
        // const bodyParameters = { key: "value" };

        try {
            let response = await axios.get(`${API_URL}/keluarga/${state.id}`)
            commit('setData', response.data.result[0]);

            return true
        } catch (e) {
            console.error(e)
            commit('setStatus', 'error');

            return false
        }
    },
    async checkKetuaLingkungan({ commit, state }) {
        try {
            let response = await axios.get(`${API_URL}/lingkungan/ketua/${state.id}`)
            
            if(response.status >= 200 && response.status < 400) {
                // set ID dari lingkungan yg diketuai
                commit('setLingkunganId', response.data.result[0].id);
            }

            return true
        } catch (e) {
            if (e.response.status == 404) {
                console.log("not ketua lingkungan")
            }
        }
    },
    checkIfTokenExpired() {
        let headers = {
            'cache-control': 'no-cache'
        };
        let accessToken = localStorage.getItem('appKey');
    
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}