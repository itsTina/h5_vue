<template>
  <div class="topic-container">
  	<header>{{msg}}</header>
    <div id="wrapper">
         <div id="scroller">
             <div id="J_PullDown" class="ui-refresh-down" style="display:none;"><span class="refresh-down-label"></span></div>
             <ul id="thelist" class="topic-info" data-curPage="" data-maxPage="">
                 <img class="loading-img" src="../assets/loading.gif">
             </ul>
             <div id="J_PullUp" class="ui-refresh-up" style="display:none;"><span class="refresh-up-label">加载更多</span><img class="pull-up-img" src="../assets/loading.gif"></div>
         </div>
    </div>
    <div id="J_ErrorTip" class="error-tip"></div>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import axios from 'axios';
import getConfig from '../utils/config';
import {getUrl} from '../utils/WebRequest';
var config = getConfig();
import MenuFooters from './Footer'

//上拉请求标示位
let pullUpActionFlag = true;

const IScroll = window.iScroll;

let myScroll;

let pullDownEl;
let pullDownOffset;
let pullUpEl;
let pullUpOffset;

let maxPage;
let curPage;

export default {
  name: 'Topic',
  components: {
    MenuFooters
  },
  data () {
    return {
      msg: '话题列表',
      user:{ topicid: '', pageindex: 1, pagesize: 10 },
      topicResult:{},
      currentMenuType: 'topic',
      isHide:false
    }
  },

  methods: {
        errorTip: function($target, tip) {
          $target.show();
          $target.text(tip);

          setTimeout(function() {
              $target.removeClass('error-tip');
              $target.addClass('error-tip-fade');

              setTimeout(function() {
                  $target.removeClass('error-tip-fade');
                  $target.addClass('error-tip');

                  $target.hide();
              }, 500);
          }, 2000);
        },

       getTopicList: function(){
           var formData = JSON.stringify(this.user);

           axios.post(getUrl(config.url_map.topicList), JSON.parse(formData))
               .then(function(res) {
                   if (res.data.status.error_code === 0) {
                        //this.topicResult = res.data.bizobj;

                        let strHtml = '';

                        for(var i=0;i<res.data.bizobj.length;i++){
                          strHtml = strHtml + '<li>'+
                                                '<a href="/#/topicInfo/'+ res.data.bizobj[i].topicid +'">'+
                                                '<div class="topic-content clearfix">'+
                                                    '<div class="content-img f-l"><img src="'+ res.data.bizobj[i].imgurl +'"/></div>'+
                                                    '<div class="content-aside">'+
                                                        '<ul>'+
                                                            '<li class="title">'+ res.data.bizobj[i].title +'</li>'+
                                                            '<li class="nametime"><span class="col1">'+ res.data.bizobj[i].publishdate +'</span><span class="p-c">'+ res.data.bizobj[i].entname +'</span></li>'+
                                                            '<li class="t-w">'+ res.data.bizobj[i].summary +'</li>'+
                                                        '</ul>'+
                                                    '</div>'+
                                                '</div>'+
                                                '</a>'+
                                            '</li>';
                        }

                        $('#thelist').html(strHtml);

                        setTimeout(function() {myScroll.refresh();}, 200);

                        maxPage = res.data.page_info.total_pages;
                        curPage = res.data.page_info.cur_page;

                        $('#thelist').attr({
                            'data-maxPage': maxPage,
                            'data-curPage': curPage
                        });

                        $('#J_PullUp').find('.refresh-up-label').text('加载更多');

                        maxPage > 1 ? $('#J_PullUp').show() : $('#J_PullUp').hide();
                   }else{
                        $('#J_PullUp').hide();

                        $('#thelist').html('<div class="empty-data">' + res.data.status.error_msg + '</div>');
                   }
               }.bind(this))
               .catch(function(err) {
                 console.log(err);
               });
       },

       pullDownAction: function(){
           myScroll.refresh();
       },

       pullUpAction: function(){
           var that = this;

           pullUpActionFlag = false;

           pullUpEl.find('.pull-up-img').show();

           if (pullUpEl.css('display') === 'none') {
               return false;
           } else if (parseInt($('#thelist').attr('data-curPage')) > parseInt($('#thelist').attr('data-maxPage'))) {
               pullUpEl.find('.pull-up-img').hide();

               pullUpEl.find('.refresh-up-label').html('加载完毕');
           } else {
               setTimeout(function() {
                    //上拉加载数据
                    that.user.pageindex = curPage;

                    var formData = JSON.stringify(that.user);

                   axios.post(getUrl(config.url_map.topicList), JSON.parse(formData))
                       .then(function(res) {
                           if (res.data.status.error_code === 0) {
                                pullUpEl.find('.pull-up-img').hide();

                                //this.topicResult = res.data.bizobj;

                                let strHtml = '';

                                for(var i=0;i<res.data.bizobj.length;i++){
                                                          strHtml = strHtml + '<li>'+
                                                                               '<a href="/#/topicInfo/'+ res.data.bizobj[i].topicid +'">'+
                                                                                '<div class="topic-content clearfix">'+
                                                                                    '<div class="content-img f-l"><img src="'+ res.data.bizobj[i].imgurl +'"/></div>'+
                                                                                    '<div class="content-aside">'+
                                                                                        '<ul>'+
                                                                                            '<li class="title">'+ res.data.bizobj[i].title +'</li>'+
                                                                                            '<li class="nametime"><span class="col1">'+ res.data.bizobj[i].publishdate +'</span><span class="p-c">'+ res.data.bizobj[i].entname +'</span></li>'+
                                                                                            '<li class="t-w">'+ res.data.bizobj[i].summary +'</li>'+
                                                                                        '</ul>'+
                                                                                    '</div>'+
                                                                                '</div>'+
                                                                                '</a>'+
                                                                            '</li>';
                                                        }

                                $('#thelist').append(strHtml);

                                setTimeout(function() {myScroll.refresh();}, 200);

                                curPage++;

                                $('#thelist').attr('data-curPage', curPage);

                                maxPage > 1 ? pullUpEl.show() : pullUpEl.hide();
                           }else{
                                $('#J_PullUp').hide();

                                $('#thelist').html('<div class="empty-data">' + res.data.status.error_msg + '</div>');
                           }

                           pullUpActionFlag = true;
                       }.bind(this))
                       .catch(function(err) {
                         console.log(err);

                         pullUpActionFlag = true;
                       });
               }, 300);
           }
       },

       loaded: function(){
            let that = this;

            pullDownEl = $('#J_PullDown');
            pullDownOffset = pullDownEl.offset().height;
            pullUpEl = $('#J_PullUp');
            pullUpOffset = pullUpEl.offset().height;

            myScroll = new IScroll('wrapper', {
                useTransition: true,
                onRefresh: function() {
                    if (pullDownEl.hasClass('loading')) {
                        pullDownEl.attr('class', '');
                        pullDownEl.find('.refresh-down-label').html('');
                    } else if (pullUpEl.hasClass('loading')) {
                        pullUpEl.attr('class', '');
                        pullUpEl.find('.refresh-up-label').html('加载更多');
                    }
                },
                onScrollMove: function() {
                    if (this.y > 5 && !pullDownEl.hasClass('flip')) {
                        pullDownEl.attr('class', 'flip');
                        pullDownEl.find('.refresh-down-label').html('上拉加载数据');
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.hasClass('flip')) {
                        pullDownEl.attr('class', '');
                        pullDownEl.find('.refresh-down-label').html('');
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
                        pullUpEl.attr('class', 'flip');
                        pullUpEl.find('.refresh-up-label').html('正在加载中...');
                        this.maxScrollY = this.maxScrollY;
                    } else if (this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
                        pullUpEl.attr('class', '');
                        pullUpEl.find('.refresh-up-label').html('加载更多');

                        this.maxScrollY = pullUpOffset;
                    }
                },
                onScrollEnd: function() {
                    if (pullDownEl.hasClass('flip')) {
                        pullDownEl.attr('class', 'loading');
                        pullDownEl.find('.refresh-down-label').html('');
                        that.pullDownAction();
                    } else if (pullUpEl.hasClass('flip')) {
                        pullUpEl.attr('class', 'loading');

                        pullUpEl.find('.refresh-up-label').html('');

                        if (curPage > maxPage) {
                            that.pullDownAction();

                            pullUpEl.find('.refresh-up-label').html('加载完毕');
                        } else if(pullUpActionFlag){
                            that.pullUpAction();
                        }
                    }
                }
            });

            setTimeout(function() { document.getElementById('wrapper').style.left = '0';}, 800);
       }
  },

  created: function(){
    this.getTopicList();
  },

  mounted: function(){
    //document.addEventListener('touchmove', function(e) { e.preventDefault();}, false);

    setTimeout(this.loaded, 200);
  }
}
</script>


