/**
 * Created by Administrator on 2017/8/18.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const state = {
  userInfo:{},
  message:{},
  count:0
};

const mutations = {

  refreshUserInfo(state){
    state.count++
    // state.userInfo = function () {
    //   this.$http.post("http://192.168.0.152:8081/person-info",
    //     { userId:sessionStorage.uid },
    //     json => {
    //       console.log(json);
    //       if(json.returnCode===200){
    //         return json.data
    //       }else {
    //         return {}
    //       }
    //     })
    // }
  }
};

const actions = {
  // updateUserInfo:({commit}) => commit("updateUserInfo")
};

const  getters = {
  userInfo: state => {
    return state.userInfo
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
