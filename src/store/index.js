import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    saveUser (state, data) {
      console.log(data)
      state.user = data
      auth.setUser(state.user)
    }
  },
  actions: {

  }
})

export default store
