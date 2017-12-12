import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        authProfile: null,
        prices: null,
    },

    mutations: {
        authProfile (state, payload) {
            state.authProfile = payload;
        },
        prices (state, payload) {
            state.prices = payload;
        }
    }
});
