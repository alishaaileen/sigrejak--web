const state = () => {
    return {
        active: false,
    }
}

const mutations = {
    setModal(state) {
        state.active = true
    },
    resetModal(state) {
        state.active = false
    },
}

const actions = {
    openModal({commit}) {
        commit('setModal')
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}