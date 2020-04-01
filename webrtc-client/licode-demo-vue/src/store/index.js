import Vue from 'vue'
import Vuex from 'vuex'
import {getCourseList} from '@/api/getdata'

Vue.use(Vuex)

const state = {
    userInfo: {},
}

const mutations = {
    saveUserInfo(state, userInfo){
        state.userInfo = userInfo;
    },
}

const actions = {
    getUserData({commit}, path){
        getCourseList({
            data     : {},
            callback : (res) => {
                console.log(1)
                commit('saveUserInfo', res);

            },
            errorback: () => {
                commit('saveUserInfo', {'name': '12'});
            }
        })
    },

}

export default new Vuex.Store({
    state,
    actions,
    mutations,
})