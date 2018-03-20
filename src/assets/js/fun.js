/**
 * Created by Administrator on 2017/9/15.
 */
let ERR_OK = 200;
let ERR_NO = 400;
exports.install = function (Vue, options) {
  // 异步请求统一设置
  Vue.prototype.$ajax = function (url, data,callBack, type,dataType,show) {
    //如果没有显示loading动画，则此时isHideLoading会被赋值成一个函数，而如果第四个参数也没有传，第四个参数就是undefined

    // 添加或者更新时显示加载层
    let update = [
      'person-login',
      'add-getcomminfo',
      'add-replyInfo',
      'comm-GiveThumbs',
      'pcomm-addParagraphcomment',
      'books-addvolume',
      'bookshelf-adduserbookshelf',
      'user-signin'
    ]
    let get = [
      'fans-Follow',
      'fans-myFans',
      'person-message',
      'comm-coverRelyInfo',
      'sys-getsystemmsg',
      'userRmemberChose',
      'comm-HotCommentInfo',
      'person-UserBookReadRecord',
      'books-authorChapterList',
      'books-volumeChapterList',
      'getAuthorMonthlyreportByAuthormonByAuthorIDWeb'
    ]
    let load = false,tip = true,loading
    for(let j=0,len=update.length;j<len;j++){
      if(url.split("/")[1].split("?")[0]==update[j]){
        load = true
        break;
      }
    }
    for(let k=0,len=get.length;k<len;k++){
      if(url.split("/")[1].split("?")[0]==get[k]){
        tip = false
        break;
      }
    }

    if(load){
      loading = this.$loading({
        lock: true,
        text: '数据努力提交中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }

    if (this.$http.isFunction(data)) {
      callBack = data;
    }
    this.$http.ajax({
      type:!type?'post':type,
      url:'http://www.lajixs.com'+url,
      data:data,
      dataType:!dataType?'json':dataType,
      success:(res)=>{
        if(load){
          this.$nextTick(()=>{
            loading.close()
          })
        }
        if(res.data){
          if(res.data.list===null){res.data.list = []}
        }
        if (callBack && this.$http.isFunction(callBack)) {
          callBack(res);
        }
        if(res.returnCode===400){
          this.$cookie('user_id','',-1);
          if(show!=='custom'){
            this.$router.push('/login')
          }
        }else if(res.returnCode===1000) {
          this.$router.push('/error/404');
        }else{
          if(res.returnCode!==200 && res.returnCode!==2000 && show===undefined && tip){
            this.$message({message:res.msg,type:'warning'})
          }
        }
      },
      error:(err)=>{
        if(load){
          this.$nextTick(()=>{
            loading.close()
          })
        }
        if(err.status===404){
          this.$message({message:'请求失败，请求方法不存在！',type:'error'})
        }else if(err.status===503){
          this.$message({message:'请求失败，服务器内部错误！',type:'error'})
        }else if(err.status===0){
          this.$message({message:'网络错误，请检查您的网络连接是否正常！',type:'error'})
        }else{
          this.$message({message:'请求失败，网络请求超时！',type:'error'})
        }
        console.log(err)
      }
    });
  };

  // 校验文本内容是否包含emoji 表情
  Vue.prototype.$regEmoji = function (val) {
    let regx = /[\ud83c-\ud83e][\udc00-\udfff]|[\u2600-\u27ff]/
    return regx.test(val)
  }

  Vue.prototype.$cancelSave = function(bid){
    console.log(bid)
    this.$ajax("/bookshelf-delteuserbookshelfById",{ bookid:bid },json=>{
      if(json.returnCode===200){
        this.$message('取消成功')
      }
    })
  }
  // 添加关注
  Vue.prototype.$addAttention = function (index,type){
    if(!this.$store.state.userInfo.userId){this.$router.push('/login');return false}
    let data;
    if(index>=0){
      let id,name;
      if(type==='fans'){
        id = this.fansList.list[index].userId;
        name = this.fansList.list[index].followUserName;
      }else if(type==='ate') {
        id = this.attentionList.list[index].followId;
        name = this.attentionList.list[index].followUserName;
      }
      data = {
        token:this.$store.state.userInfo.userId,
        followUserName:name,
        followId:id
      };
    }else {
      data = {
        token:this.$store.state.userInfo.userId,
        followUserName:this.readerInfo.pseudonym,
        followId:this.readerInfo.userId
      }
    }
    this.$ajax("/fans-addFans", data,(json)=>{
      if(json.returnCode===200){
        this.$message("关注成功");
        if(index>=0){
          if(type==='fans'){
            this.fansList.list[index].isfollow = true
          }else if(type==='ate') {
            this.attentionList.list[index].isfollow = true
          }
        }else{
          this.readerInfo.isfollow = true
        }
      }else {
        this.$message(json.msg)
      }
    })
  };
  // 取消关注
  Vue.prototype.$cancelAttention = function(index,type){
    if(!this.$store.state.userInfo.userId){this.$router.push('/login');return false}
    let data;
    if(index>=0){
      let id;
      if(type==='fans'){
        id = this.fansList.list[index].userId
      }else if(type==='ate') {
        console.log(this.$route.name);
        id = this.attentionList.list[index].followId
      }
      data = {
        followId:id,
        userid:this.$store.state.userInfo.userId
      };
    }else {
      data = {
        followId:this.readerInfo.userId,
        userid:this.$store.state.userInfo.userId
      }
    }
    this.$alert('', '您要取消关注吗？(⋟﹏⋞)', {
      confirmButtonText: '是',
      showCancelButton:true,
      customClass:'middle confirm-msg-box',
      cancelButtonText:'否',
      callback: action => {
        if(action==='confirm'){
          this.$ajax("/fans-CancelFollow",data,json=>{
            if(json.returnCode===200){
              this.$message("取消关注");
              if(index>=0){
                if(type==='fans'){
                  this.fansList.list[index].isfollow = false
                }else if(type==='ate'){
                  this.attentionList.list[index].isfollow = false
                }
              }else {
                this.readerInfo.isfollow = false
              }
            }else{
              this.$message(json.msg)
            }
          })
        }
      }
    });

  };
  Vue.prototype.$formTime = function (date,type,separator) {
    separator = separator===undefined?"-":separator;
    let time = new Date(date) || new Date();
    let now = new Date(date).getFullYear() || new Date().getFullYear();
    let days = 0;
    let sumTime,Time,T;
    T = time
    let year = T.getFullYear();
    let mon  = T.getMonth()+1<10?'0'+(T.getMonth()+1):T.getMonth()+1;
    let Date1 = T.getDate()<10?'0' + T.getDate():T.getDate();
    let hour = T.getHours()<10?'0' + T.getHours():T.getHours();
    let min  = T.getMinutes()<10?'0'+T.getMinutes():T.getMinutes();
    let sec  = T.getSeconds()<10?'0'+T.getSeconds():T.getSeconds();
    if(type==='long'){
      Time = year + separator + mon + separator + Date1 + ' ' + hour + ':' + min +':' + sec
    }
    if(type==='middle'){
      Time = year + separator + mon + separator + Date1 + ' ' + hour + ':' + min
    }
    if(type==='sort'||type===undefined){
      Time = year + separator + mon + separator + Date1
    }
    return Time
  };
  // 个人信息刷新
  Vue.prototype.$freshen = function () {
    this.$ajax("/person-info",'',json=>{
      if(json.returnCode===ERR_OK){
        this.$store.state.userInfo = json.data
      }else if(json.returnCode===ERR_NO){
        this.$router.push('/login')
      }
    })
  };
  // 更新用户信息通知
  Vue.prototype.$updateCount = function () {
    this.$ajax("/person-messageCount",'',json=>{
      if(json.returnCode===200){
        json.data.total = json.data.userMessageCount + json.data.userCommentReplyCount;
        json.data.total = json.data.total>99?'99+':json.data.total;
        this.$store.state.message = json.data
      }

    },'post','json',true)
  };
  // 退出登录
  Vue.prototype.$exit = function (type) {
    let method = () =>{
      this.$ajax("/person-ClearUserInfo",'',json=>{
        if(json.returnCode===ERR_OK){
          this.$cookie('user_id','',-1);
          this.$store.state.userInfo = {};
          if(!type){
            if(this.$route.name==='modifyPage' || this.$route.name==='findPage'){
              this.$message("修改成功！");
              this.$router.push("/login?redirect=/index")
            }else {
              this.$message("退出成功！");
              this.$router.push('/');
            }
          }
        }
      });
    };
    if(type!=='modifyPage' && this.$route.name!=='findPage'){
      this.$alert('确认退出？', '', {
        confirmButtonText: '确  定',
        customClass:'issue-alert',
        lockScroll:false,
        type:'success',
        callback: action => {
          if(action==='confirm'){
            method();
          }
        }
      });
    }else {
      method()
    }
  };
  // cookies 设置、获取、删除
  Vue.prototype.$cookie = (key,value,expiredays,path,domain)=>{
    if(typeof value !== "undefined"){//write
      let cookieValue = key + "=" + encodeURIComponent(value)
      if(expiredays){
        let exdate = new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        cookieValue += ";expires="+exdate.toGMTString()
      }

      cookieValue += ";path=" + (path?path:'/')
      if(domain){
        cookieValue += ";domain=" + domain
      }

      document.cookie = cookieValue;
    }else{//read
      if (document.cookie.length>0) {
        var cookie = {}, all = document.cookie, list, item, index;
        if (all === '') {
          return cookie;
        }
        list = all.split('; ');
        for (var i = 0, len = list.length; i < len; i++) {
          item = list[i];
          index = item.indexOf('=');
          var cookieNow;
          try {
            cookieNow = decodeURIComponent(item.substring(index + 1));
          } catch (e) {
            cookieNow = item.substring(index + 1);
          }
          cookie[item.substring(0, index)] = cookieNow;
        }
        return cookie[key];
      }else {
        return null
      }
    }
  };
  // 用户点赞
  Vue.prototype.$userLaud = (id,type)=>{
      this.$ajax('/comm-GiveThumbs',{commentId:id},json=>{
      })
  };
  Vue.prototype.$isLogin = function(){
    let state;
    this.$ajax("/person-checkLoginState",json=>{
      state = json
    });
  };
  // 用户发送私信
  Vue.prototype.$send = function (type, data) {
    if(this.$cookie('user_id')){
      this.$consume({
        type:type,
        value:data,
        beforeClose:(action,instance,done) => {
          if(action=='confirm' && type=='letter'){
            let len = this.$http.trim(instance.messageContent).length;
            if(len<=100 && len>0){
              let sub = {
                userName:this.$store.state.userInfo.pseudonym,
                messageContent:instance.messageContent
              }
              for(let k in data){
                if(k!=='default'){
                  sub[k] = data[k]
                }
              }
              this.$ajax("/person-sendmessage",sub,json => {
                done();
                if(json.returnCode===ERR_OK){
                  this.$message({message:"操作成功"});
                  if(this.$route.name==='messageHarvest'){
                    this.harvest(this.harvestList.pageNum)
                  }
                }
              })
            }else if(len==0) {
              this.$message({message:'请输入内容！',type:'warning'})
            }else {
              this.$message({message:'字数超过限制，请精简后再发送！',type:'warning'})
            }
          }else {
            done()
          }
        }
      })
    }else {
      this.$router.push("/login")
    }
  };
  // 检测浏览器是否为IE
  Vue.prototype.$isIE = function () {
    if (!!window.ActiveXObject || "ActiveXObject" in window){
      return true;
    }else{
      return false;
    }
  };
  Vue.prototype.$enableCookie = function () {
   if(window.navigator.cookieEnabled){
      // console.log('可用')
   }else {
     // console.log("不可用")
   }
  };
  // 格式化私信、回复、书评 内容
  Vue.prototype.$formatMsg = function(val){
    let str = val
    if(str){
      str = this.$http.trim(str).replace(/\s*\n+\s*/g,'\n  ');
    }
    return str
  };

  // loading 加载遮罩层

  Vue.prototype.$myLoad = function (txt) {
    this.$loading({
      lock: true,
      text: !txt?'数据努力提交中...':txt,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }

  // 格式化章节内容
  Vue.prototype.$resetChapterTxt = (txt) =>{
    if(txt){
      let reg1 = /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/g;
      let reg2 = /<LG>[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}<\/?LG ?\/?>/g;
      let newArr = [];
      let idArr = txt.match(reg1);
      let txtArr = txt.replace(/(&nbsp;||\s){2,4}/g,'').split(reg2);
      if(!txt.split(reg2)){
        txtArr = txt.split(reg2).splice(1)
      }
      idArr.forEach(function (item,index) {
        newArr.push({
          id:item,
          content:txtArr[index]
        })
      });
      return newArr;
    }
  };

};
