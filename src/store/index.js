import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      auth.svaeUser(state.user)
    }
  },
  actions: {

  }
})

export default store
