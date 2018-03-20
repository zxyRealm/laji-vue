// this is aliased in webpack config based on server/client build
// import {createAPI} from './create-api-client';
// import Category from '../config/category';
import LRU from 'lru-cache'
import axios from 'axios';
import {Message} from 'element-ui'
const logRequests = true || !!process.env.DEBUG_API;
const prod = process.env.NODE_ENV == 'production'
const api = createAPI();

function createAPI() {
  let api = {};
  api.onServer = true;
  // api.cachedItems = LRU({
  //   max: 1000,
  //   maxAge: 1000 * 60 * 2 // 2 min cache
  // });
  return api;
}

function fetchUrl (url) {
  if(!prod){
    url = 'http://www.lajixs.com' + url
  }
  return url
}

// warm the front page cache every 15 min
// make sure to do this only once across all requests

function fetch(child,data,type,tip=true) {
    let format = ''
    child = fetchUrl(child)
    if(typeof data !=='string'){
      for (let k in data){
        format += k+'='+ data[k] +'&'
      }
      data = format.slice(0,-1)
    }else {
      tip = type
      type = data
      data = {}
    }
    // logRequests && console.log(`fetching ${child}...`)
    const cache = api.cachedItems;
    if (cache && cache.has(child)) {
        // logRequests && console.log(`cache hit for ${child}.`)
        return Promise.resolve(cache.get(child))
    } else {
        return new Promise((resolve, reject) => {
            if(type==='get'){
              axios.get(child,data).then(res => {
                const val = res.data;
                if (val) val.__lastUpdated = Date.now()
                cache && cache.set(child, val);
                // logRequests && console.log(`fetched ${child}.`);
                resolve(val);
                if(res.data.returnCode!==200 && tip){
                  Message({message:res.data.msg,type:'warning'})
                }
              }, reject).catch(reject);
            }else {
              axios.post(child,data).then(res => {
                const val = res.data;
                if (val) val.__lastUpdated = Date.now()
                cache && cache.set(child, val);
                // logRequests && console.log(`fetched ${child}.`);
                resolve(val);
                if(res.data.returnCode!==200 && tip){
                  Message({message:res.data.msg,type:'warning'})
                }
              }, reject).catch(reject);
            }
        })
    }
}

// 网站首页数据获取
export function FetchIndexData () {
  return fetch('/indexdataload','get')
}
// 首页最新更新书籍和最新签约书籍
export function FetchIndexLatest () {
  return fetch('/getMaxNewChapterVOList','get',false)
}
// 首页最新签约
export function FetchIndexSign() {
  return fetch("/stacks-bookFiltering",{type:4,page:1},'post',false)
}

// 网站排行榜数据加载
export function FetchRankData (type,page) {
  return fetch('/books-rank',{type:type,page:page},'post',false)
}

// 网站书库数据加载
export function FetchClassfictionData (op1,op2,op3,op4,op5,page,op6) {
  let data = {
    bookClassificationid:op1,
    bookWorldCount:op2,
    updateTime:op3,
    bookStatus:op4,
    bookCheckStatus:op5,
    startPage:page
  }
  if(Number(op6)){
    data.bookLabid = op6
  }
  return fetch("/stacks-bookFiltering",data,'post',false)
}

// 书籍详情页数据加载
// 书籍信息
export function FetchBookDetailData (bid) {
  return fetch('/book-bookInfo',{bookid:bid},'post',false)
}
// 章节列表
export function FetchChapterList (bid) {
  return fetch('/books-volumeChapterList/'+bid,'get',false)
}

// 书籍评论信息列表
export function FetchBookCommentList (bid,page) {
  return fetch('/comm-getcomminfo',{id:bid,startPage:page,commentType:0,type:1,},'post',false)
}

export function FetchBookCommentHot (bid) {
  return fetch('/comm-HotCommentInfo',{bookid:bid},'post',false)
}

// 书评回复列表
export function FetchBookCommentReply (page,cid) {
  return fetch("/comm-replyInfo",{commentid:cid,startPage:page},'post',false)
}

// 书籍阅读记录
export function FetchReadingLog (bid,type,select) {
  return fetch("/userRmemberChose",{bookid:bid,type:type,isisSelect:select},'post',false)
}

