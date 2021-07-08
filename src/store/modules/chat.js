const state = () => {
    return {
        detailPageUrl: '',
        endpointUrl: '',
    }
}

const mutations = {
    setChat(state, chat) {
        state.detailPageUrl = chat.detailPageUrl
        state.endpointUrl = chat.endpointUrl
    },
    resetChat(state) {
        state.detailPageUrl = ''
        state.endpointUrl = ''
    },
}

const actions = {
    setChat({commit}, chat) {
        commit('setChat', chat)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}