const state = () => {
    return {
        active: false,
    }
}

const mutations = {
    setLoading(state) {
        state.active = true
    },
    resetLoading(state) {
        state.active = false
    },
}

const actions = {
    openLoading({commit}) {
        commit('setLoading')
    },
    closeLoading({commit}) {
        commit('resetLoading')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}