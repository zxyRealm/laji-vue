<template id="total">
    <div class="container clear">
      <vue-classify v-if="$route.name==='totalChild'"></vue-classify>
      <div class="total-content clear">
        <div class="main-left clear">
          <router-view></router-view>
        </div>
        <div class="main-right">
          <!--热门标签 列表 start-->
          <div class="hot-label">
            <div class="heading">
              <div class="l f-title normal">
                热门标签
              </div>
            </div>
            <ul class="hot-label-list clear">
              <li>
                <router-link :to="{name:'totalChild',params:{op6:0}}">全部</router-link>
              </li>
              <li v-for="(item,$index) in labelList" v-if="$index<11">
                <router-link :to="{name:'totalChild',params:{op6:item.id}}">{{item.bookLableName}}</router-link>
              </li>
            </ul>
          </div>
          <!--热门标签 列表 end-->
          
          <!--新书推荐  begin-->
          <div class="sales-list">
            <div class="heading">
              <div class="l f-title normal">
                畅销榜
              </div>
            </div>
            <ul class="rank-list">
              <template v-if="sellList" v-for="(item,$index) in sellList">
                <li v-if="$index===0">
                  <router-link :to="'/book/'+item.bookId" class="cover">
                    <img :src="item.bookImage" alt="">
                  </router-link>
                  <div class="info">
                    <div class="b-title txt-overflow">
                      <router-link :to="'/book/'+item.bookId">
                        {{item.bookName}}
                      </router-link>
                    </div>
                    <div class="b-writer txt-overflow">
                      <p>{{item.writerName}}</p>
                    </div>
                    <div class="class-name">
                      {{item.classificationName}}
                    </div>
                  </div>
                </li>
                <li v-else-if="$index<10 && $index>0">
                  <div class="order">
                    {{$index<9?'0'+($index+1):($index+1)}}
                  </div>
                  <div class="txt-overflow">
                    <router-link :to="'/book/'+item.bookId" :title="item.bookName">
                      【{{item.classificationName}}】 {{item.bookName}}
                    </router-link>
                  </div>
                </li>
              </template>
              <li class="more">
                <router-link to="/rank/sell">查看更多&emsp;&emsp;
                  <i class="el-icon-arrow-right"></i>
                </router-link>
              </li>
            </ul>
          </div>
          <!--新书推荐 end-->
         
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Router from 'vue-router'
  import '../../assets/css/common.styl'
  import Class from '../nav/class.vue'
  export default({
    props:{
      userInfo:Object
    },
    data() {
      return {
        sellList:[],
        page: 1,
        pageSize: 10,
        total: 150,
        maxPage: 5,
        labelList:[]
      }
    },
    components: {
      'vue-classify': Class
    },
    methods: {
      toTop(){
          window.scrollTo(0,0)
      },
      pageHandler: function (page) {
        this.page = page;
        this.$route.params.page = this.page;
      },
      getSellerList(){
        this.$ajax("/ranking-book",{type:5},json=>{
          if(json.returnCode===200){
            this.sellList = json.data.total
          }
        })
      },
      getHotLabel(){
        this.$ajax("/stacks-hotLable",'',json=>{
            if(json.returnCode===200){
                this.labelList = json.data
            }
        },'get');
        this.$ajax("/stacks-changxiaobang",'',json=>{
            if(json.returnCode===200){
               this.sellList = json.data
            }
        },'get')
      }
    },
    created() {
      this.getHotLabel();
    }
  })

</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.total-content
  overflow hidden
.main-right
  margin-top:12px
  .hot-label
    margin-top :10px
    .hot-label-list
      li
        float left
        height :30px
        line-height :28px
        text-align:center
        width :50px
        margin-right :30px
        margin-bottom: 16px
        a
          display block
          width 100%
          border:1px solid #e8e8e8
          background: #f9f7f8
          border-radius :4px
          &.active
            box-shadow none
          &.active
          &:hover
            border-color :#F77583
            color :#F77583!important
            background #fff
  .el-pagination
    margin: 15px 0
  
</style>
