/**
 * Created by Administrator on 2017/9/18.
 */
import Common from '../assets/js/common'
import {
  FetchIndexData,
  FetchRankData,
  FetchIndexLatest,
  FetchIndexSign,
  FetchClassfictionData,
  FetchBookDetailData,
  FetchChapterList,
  FetchBookCommentList,
  FetchBookCommentReply,
  FetchBookCommentHot
} from '../api'
import { WEB_INDEX_INFO } from './mutations'
export default {
  // 网站首页数据
  FETCH_INDEX_DATA:({commit})=>{
   return FetchIndexData().then(data=>{
       data.data.bookBatch = data.data.homePageRecommendedByClassFuction.slice(0,6); //          分类推荐
       data.data.newBook = data.data.newBookRecommendedList.slice(0,10);  //          新书推荐
       commit("SET_INDEX_DATA",{total:data})
     }),
     FetchIndexLatest().then(data=>
       commit("SET_INDEX_DATA",{latest:data}) //最新更新、最新签约
     ),
     FetchIndexSign().then(data=>{
       commit("SET_INDEX_DATA",{sign:data})
     })
  },

  // 网站排行榜数据获取
  FETCH_RANK_DATA:({commit},{})=>{
    return FetchRankData().then(data=>{
      commit("SET_RANK_DATA",data)
    })
  },

  // 书籍详情页
  FETCH_BOOK_DETAIL:({commit,dispatch},{bid})=>{
   commit('SET_LOADING',true)
   return FetchBookDetailData(bid).then(data=>{
     commit("SET_LOADING",false)
     if(data.returnCode===2000){
       data.data.bookListInfo = ''
     }else if(data.returnCode===200) {
       let desc = data.data.bookListInfo.bookName + '是辣鸡小说网作者'+data.data.bookListInfo.writerName+'全力打造的一部'+data.data.bookListInfo.classificationName+'小说，辣鸡小说第一时间提供'+data.data.bookListInfo.bookName+'最新章节，'+data.data.bookListInfo.bookName+'全文阅读请上辣鸡小说'
       window._bd_share_config = {
         common:{
           bdText:data.data.bookListInfo.bookName+'-辣鸡小说',
           bdDesc:desc,
           bdUrl:'http://www.lajixs.com/book/'+data.data.bookListInfo.bookId,
           bdPic:data.data.bookListInfo.bookImage,
           bdStyle:0,
           bdSize:24
         },
         share : [
           //此处放置分享按钮设置
         ]
       };
       const s = document.createElement('script');
       s.type = 'text/javascript';
       s.id = 'baidu__share'
       s.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5);
       document.body.appendChild(s);
       data.data.bookListInfo.bookIntroduction = data.data.bookListInfo.bookIntroduction.replace(/\s*\n+\s*/g,"<br>　　");
       data.data.bookListInfo.lastChapter = Common.ResetChapterTxt(data.data.lastChapterView.chapterContent)
     }
      commit("SET_BOOK_DETAIL",data)
   }).then(()=>dispatch("FETCH_COMMENT_LIST",{ bid,page:1 }))
  },

  // 章节列表
  FETCH_CHAPTER_LIST:({commit},{bid})=>{
    return FetchChapterList(bid).then(data=>{
      let arr=[],list,active = []
      if(data.returnCode===200){
        list = data.data.chapterInfo
        list.forEach((item,index)=>{
          if(item.resultList.length>0){
            let counts = 0
            active.push(item.volumeId)
            item.length = item.resultList.length
            item.resultList.forEach((item2)=>{
              counts += item2.chapterLength
            })
            item.activeList = active
            item.counts = counts
            arr.push(item)
          }
        })

      }
      commit("SET_CHAPTER_LIST",arr)
    })
  },

  //书籍评论
  FETCH_COMMENT_LIST:({commit},{bid,page})=>{
    page = Number(page) || 1
    switch (page){
      case 1:{
        FetchBookCommentHot(bid).then(data1=>{
          if(data1.returnCode===200){
            FetchBookCommentList(bid,page).then(data2=>{
                data1.data.forEach((item)=>{
                  item.isHot = true;
                  for(let k=0,len=data2.data.list.length;k<len;k++){
                    if(data2.data.list[k].id===item.id){
                      data2.data.list.splice(k,1);
                      break;
                    }
                  }
                });
                data2.data.list = data1.data.concat(data2.data.list);
                commit("SET_BOOK_COMMENT_LIST",data2)
            })
          }
        })
        break
      }
      default:{
        return FetchBookCommentList(bid,page).then(data=>{
          commit("SET_BOOK_COMMENT_LIST",data)
        })
      }
    }

  },

  // 热评
  FETCH_COMMENT_HOT:({commit},{bid})=>{
    return FetchBookCommentHot(bid).then(data=>{
      commit("SET_BOOK_COMMENT_HOT",data)
    })
  },

  // 书评回复
  FETCH_COMMENT_REPLY:({commit,state},{index,page})=>{
    const basic = state.bookCommentList.data.list[index]
    page = page || 1
    return FetchBookCommentReply(basic.id,page).then(data=>{
      commit("SET_BOOK_COMMENT_REPLY",{data,index})
    })
  }
}
