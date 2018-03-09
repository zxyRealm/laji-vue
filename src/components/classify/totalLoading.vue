<template>
  <div class="stack-list-wrapper">
    <ul class="stack-list total-list">
      <li v-if="dataList.list && dataList.list.length<1" class="error-empty">
        <p class="txt">没有相关数据</p>
      </li>
      <template v-if="dataList">
        <li v-for="(item,$index) in dataList.list" class="clear stack-item">
        <router-link :to="'/book/'+item.bookId" >
          <img class="book-cover" :src="item.bookImage" alt="">
          <i v-if="item.bookAuthorization" class="zdy-icon__sign">签约</i>
        </router-link>
        <div class="si-fr">
          <div class="bTitle">
            <p class="title">
              <router-link class="txt-overflow" :to="'/book/'+item.bookId" :target="'_blank'" :title="item.bookName">{{item.bookName}}</router-link>
              <i v-if="item.bookCheckStatus===2" class="zdy-icon__vip"></i>
            </p>
            <div class="handle">
              <button class="collect" @click="addBookShelf(item.bookId,item.bookName,$index)">{{item.collectionStatus?'已收藏':'收藏'}}</button>
              <router-link :to="'/book/'+item.bookId" class="read"><button>阅读</button></router-link>
            </div>
          </div>
          <div class="si-cmd">
            <table>
              <tbody>
              <tr>
                <td><p class="t-name">小说作者：</p> </td>
                <td><p class="author"><router-link :to="'/reader/'+item.bookWriterId">{{item.writerName}}</router-link></p></td>
                <td><p class="t-name name2">类别：</p></td>
                <td><p class="class">{{item.classificationName}}</p></td>
                <td><p class="t-name name2">状态：</p></td>
                <td><p class="state b-state" :class="{end:item.bookStatus}">{{item.bookStatus?'已完结':'连载中'}}</p></td>
              </tr>
              <tr>
                <td>
                  <p class="t-name">更新时间：</p>
                </td>
                <td>{{item.lastUpdateTime|time}}</td>
                <td>
                  <p class="t-name name2">字数：</p>
                </td>
                <td>{{ item.bookWorldCount}}</td>
                <td>
                </td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="si-bIntro overLine2">
            <span class="clr9">简介：</span>
            {{item.bookIntroduction}}
            
          </div>
        </div>
      </li>
      </template>
    </ul>
    <template v-if="dataList">
      <el-pagination
        v-if="dataList.total>dataList.pageSize"
        @current-change="handleCurrentChange"
        :current-page.sync="dataList.pageNum"
        :page-size="dataList.pageSize"
        layout="prev, pager, next, jumper"
        :total="dataList.total">
      </el-pagination>
    </template>
  </div>
  
</template>
<script type="text/ecmascript-6">
    export default{
      data() {
        return {
          dataList:{}
        }
      },
      methods:{
        getClassList(){
            let key = this.$route.params;
            let data = {
              bookClassificationid:key.op1,
              bookWorldCount:key.op2,
              updateTime:key.op3,
              bookStatus:key.op4,
              bookCheckStatus:key.op5,
              startPage:key.page
            };
            if(Number(key.op6)){
                data.bookLabid = key.op6
            }
            this.$ajax("/stacks-bookFiltering",data,(json)=>{
              if(json.returnCode===200){
                this.dataList = json.data;
              }
            })
        },
        handleCurrentChange(val){
          this.$router.push({name:'totalChild',params:{page:val}});
        },
        addBookShelf(bid,name,index){
          this.$ajax("/bookshelf-adduserbookshelf",{
            userName:this.$store.state.userInfo.pseudonym,
            bookId:bid,
            bookName:name
          },json=>{
            if(json.returnCode===200){
              this.$message(json.msg);
              this.dataList.list[index].collectionStatus = this.dataList.list[index].collectionStatus?0:1;
            }else if(json.returnCode===400){
              this.$router.push('/login')
            }
          })
        }
      },
      created(){
        this.$router.push({ params:{ op6:0 }});
        this.getClassList();
      },
      watch:{
        "$route":{
          handler(val,oldVal){
            if(Number(val.params.page)===Number(oldVal.params.page) && Number(oldVal.params.page)!==1){
              this.$router.push({params:{page:1}});
            }else {
              this.getClassList()
            }
          },
          deep:true
        }
      }
    }
</script>
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
.stack-list-wrapper
  padding-right 35px
  .total-list
    border 1px solid #FFCFCF
    border-top 6px solid #FFA5AF
</style>
