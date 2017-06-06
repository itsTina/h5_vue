<template>
  <div class="topicinfobox" >
    <header><a class="back" href="/#/topic"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>

    <div class="topicbox">
        <div class="topicupper">
            <h2>{{topicResult.title}}</h2>
            <span class="editor">{{topicResult.entname}}</span><span class="time">{{topicResult.publishdate}}</span>
        </div>
        <!-- 可能有图片 -->
        <div class="articlebox">
            <div v-html="topicResult.content"></div>
        </div>
        <div class="commentlist">
           <ul>
               <li v-for="item in commentResult.commentList" >
                   <a class="clickjump" v-on:click="downLoad">
                       <div class="comment-left">
                           <div class="name">{{item.author}}</div>
                           <div class="time">{{item.commenttime}}</div>
                       </div>
                       <div class="comment-right">
                           <p>{{item.comment}}</p>
                       </div>
                   </a>
               </li>
           </ul>
           <div class="morecomment" v-show="commentResult.totalItems>3">
               <a class="clickjump" v-on:click="downLoad">
                   <span class="mareimg"><img src="../assets/more.png"></span>
                   <span class="moretext">全部评论（139）</span>
               </a>
           </div>
        </div>
        <div class="articlelist">
            <div class="list-tit">相关话题</div>
                <ul>
                    <li v-for="item in topiclistResult">
                        <a class="clickjump" v-on:click="downLoad">
                            <div class="article-left"><img :src="item.imgurl"></div>
                            <div class="article-right">
                                <h5>{{item.title}}</h5>
                                <div class="author-time">
                                    <span class="time">{{item.publishdate}}</span>
                                    <span class="author">{{item.entname}}</span>
                                </div>
                                <h6>{{item.summary}}</h6>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
     </div>

    <DownloadApp></DownloadApp>

     <div id="J_ErrorTip" class="error-tip"></div>

    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import axios from 'axios'
import getConfig from '../utils/config'
import {getUrl} from '../utils/WebRequest'
import {errorTip} from '../utils/util'
import MenuFooters from './Footer'
import DownloadApp from './DownloadApp'
var config = getConfig();

export default {
  name: 'TopicInfo',
  components: {
    MenuFooters,
    DownloadApp
  },
  data () {
    return {
      msg: '话题详情',
      topic:{ topicid: this.$route.params.topicId},
      topicResult:{},
      commentResult:{commentList:[],totalItems:0},
      topiclistResult:{topiclistList:[],totalItems:0},
      currentMenuType: 'topic',
      isHide:false
    }
  },

  methods: {
        downLoad: function(){
           $('.downloadpage').show();
        },

       getTopicInfo: function(){
            var formData = JSON.stringify(this.topic);

           axios.post(getUrl(config.url_map.topicInfo), JSON.parse(formData))
               .then(function(res) {
                   if (res.data.status.error_code === 0) {
                   this.topicResult = res.data.bizobj[0];
                   } else {
                    errorTip($('#J_ErrorTip'),res.data.status.error_msg);
                   }
               }.bind(this))
               .catch(function(err) {
                 console.log(err);
               });
       },

       getTopicComment: function(){
          this.topic.pagesize = 3;
          var formData = JSON.stringify(this.topic);

          axios.post(getUrl(config.url_map.commentList), JSON.parse(formData))
              .then(function(res) {
                  if (res.data.status.error_code === 0) {
                   this.commentResult.commentList = res.data.bizobj;
                   this.commentResult.totalItems = res.data.page_info.total_items;
                  } else {
                   errorTip($('#J_ErrorTip'),res.data.status.error_msg);
                  }
              }.bind(this))
              .catch(function(err) {
                console.log(err);
              });
        },
       getTopicList: function(){
          var formData = JSON.stringify(this.topic);

          axios.post(getUrl(config.url_map.topicList), JSON.parse(formData))
              .then(function(res) {
                  if (res.data.status.error_code === 0) {
                   this.topiclistResult = res.data.bizobj;
                    this.topiclistResult.totalItems = res.data.page_info.total_items;
                  } else {
                   errorTip($('#J_ErrorTip'),res.data.status.error_msg);
                  }
              }.bind(this))
              .catch(function(err) {
                console.log(err);
              });
       }
  },

  created: function(){
    this.getTopicInfo();
    this.getTopicComment();
    this.getTopicList();
  }
}
</script>
