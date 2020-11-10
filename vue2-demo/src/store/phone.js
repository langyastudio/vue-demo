import Vue from 'vue'
import Vuex from 'vuex'
import {getCourseList} from '@/api/getdata'

Vue.use(Vuex)

const state = {
    userInfo: {}
}

const mutations = {
    saveUserInfo(state, userInfo){
        state.userInfo = userInfo;
    },
}

const actions = {
    getUserData({commit}){
        getCourseList({
            data    : {},
            callback: (res) => {
                commit('saveUserInfo', res);

            }
        })
    },

}

export default new Vuex.Store({
    state,
    actions,
    mutations,
})