const state = () => {
    return {
        active: false,
        color: '',
        text: '',
        timeout: 5000,
    }
}

const mutations = {
    setSnackbar(state, snackbar) {
        state.active = true,
        state.color = snackbar.color
        state.text = snackbar.text
    },
    resetSnackbar(state) {
        state.active = false,
        state.color = ''
        state.text = ''
    },
}

const actions = {
    openSnackbar({commit}, snackbar) {
        commit('setSnackbar', snackbar)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}