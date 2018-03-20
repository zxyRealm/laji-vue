/**
 * Created by Administrator on 2017/9/18.
 */
import Vue from 'vue'

export default {
  SET_LOADING(state,data){
      state.loading = data
  },

  // 网站首页数据
  SET_INDEX_DATA(state,data){
    if(data.total){
      Vue.set(state.indexInfo,'total',data.total) //首页总数据
    }
    if(data.latest){
      Vue.set(state.indexInfo,'latest',data.latest) //最新更新章节、最新签约书籍
    }
    if(data.sign){
      Vue.set(state.indexInfo,'sign',data.sign) //最新更新章节、最新签约书籍
    }
  },

  // 排行榜
  SET_RANK_DATA(state,{data}){
    Vue.set(state,'rankData',data)
  },

  // 书籍详情页
  //   书籍详情
  SET_BOOK_DETAIL(state,{data}){
      Vue.set(state,'bookDetail',data)
  },

  // 书籍列表
  SET_CHAPTER_LIST(state,arr){
    Vue.set(state,'chapterList',arr)
  },

  // 书评列表
  SET_BOOK_COMMENT_LIST(state,{data}){
    Vue.set(state,'bookCommentList',data)
  },

  // 热评
  SET_BOOK_COMMENT_HOT(state,{data}){
    Vue.set(state,'bookCommentList',data)
  },

  // 书评回复
  SET_BOOK_COMMENT_REPLY(state,{data,index}){
    Vue.set(state.bookCommentList.data.list[index],'childList',data)
  }
}
