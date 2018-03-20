/**
 * Created by Administrator on 2017/9/18.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import modules from './modules/index'
Vue.use(Vuex)

const state = {
  loading:false,  //数据请求状态
  userInfo:{}, //用户信息
  message:{}, //用户未读消息数目
  count:0,
  indexInfo:{
    total:{},
    latest:{},
    sign:{}
  }, // 网站首页数据
  rankData:{}, //排行榜数据
  chapterList:[], //章节列表，
  bookCommentList:{}, //书籍评论列表
  bookDetail:{}
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules,
})
export default store
