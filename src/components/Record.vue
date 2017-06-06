<template>
  <div class="record-container">
    <header><a class="back" href="/#/my"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>
    <div id="wrapper">
        <div id="scroller">
            <div id="J_PullDown" class="ui-refresh-down" style="display:none;">
              <span class="refresh-down-label"></span></div>
            <ul id="thelist" class="record-info" data-curPage="" data-maxPage="">
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
import { setSid, getSid } from '../utils/SidManager';
import errorImgUrl from '../assets/failed.png';
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

let bzEndTime;

export default {
  name: 'Record',
  components: {
      MenuFooters
    },
  data () {
    return {
      msg: '电子病历列表',
      user:{ sid: getSid(), pageindex: 1, pagesize:10 },
      recordResult:{},
      currentMenuType: 'my',
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

       getRecordList: function(){
           var formData = JSON.stringify(this.user);

           axios.post(getUrl(config.url_map.getMedicalList), JSON.parse(formData))
               .then(function(res) {
                   if (res.data.status.error_code === 0) {
                        //this.recordResult = res.data.bizobj;

                        let strHtml = '';

                        for(var i=0;i<res.data.bizobj.length;i++){
                          strHtml = strHtml + '<li>'+
                                                   '<a href="/#/case?medicalId='+ res.data.bizobj[i].medicalid +'">'+
                                                   '<div class="record-content">'+
                                                       '<div class="content-top col1"><span>'+ res.data.bizobj[i].date_info[0] + '</span><span>('+ res.data.bizobj[i].date_info[1] + ')</span><span>'+ res.data.bizobj[i].date_info[2] + '</span></div>'+
                                                       '<div class="content-bottom">'+
                                                       '<ul>'+
                                                           '<li><span class="f-z">'+ res.data.bizobj[i].patient_name + '</span><span class="p-c">'+ res.data.bizobj[i].patient_sex + '&nbsp;'+ res.data.bizobj[i].patient_age +'岁</span><span class="f-c">&yen;'+ res.data.bizobj[i].total_price +'</span></li>'+
                                                           '<li><span>'+ res.data.bizobj[i].hospital +'</span><span>&nbsp;&nbsp;'+ res.data.bizobj[i].department +'</span></li>'+
                                                           '<li><span>主治医生：'+ res.data.bizobj[i].doctor_name +'</span></li>'+
                                                       '</ul>'+
                                                       '</div>'+
                                                   '</div>'+
                                                   '</a>'+
                                               '</li>';
                        }

                        $('#thelist').html(strHtml);

                        setTimeout(function() {myScroll.refresh();}, 200);

                        bzEndTime = res.data.page_info.latest_reception_time;

                        maxPage = res.data.page_info.total_pages;
                        curPage = res.data.page_info.cur_page;

                        $('#thelist').attr({
                            'data-maxPage': maxPage,
                            'data-curPage': curPage
                        });

                        $('#J_PullUp').find('.refresh-up-label').text('加载更多');

                        maxPage > 1 ? $('#J_PullUp').show() : $('#J_PullUp').hide();
                   }else if(res.data.status.error_code === 2){
                        this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);

                        setTimeout(function(){
                            window.location.href = '/#/login';
                        },3000);
                   }else{
                        $('#J_PullUp').hide();

                        $('#thelist').html('<div class="empty-data"><span class="tipimg"><img src="'+ errorImgUrl +'"></span><span class="tiptext">暂时没有您的记录</span></div>');
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
                    that.user.pageindex = 0;
                    that.user.bzEndTime = bzEndTime;

                    var formData = JSON.stringify(that.user);

                   axios.post(getUrl(config.url_map.getMedicalList), JSON.parse(formData))
                       .then(function(res) {
                           if (res.data.status.error_code === 0) {
                                pullUpEl.find('.pull-up-img').hide();

                                //this.recordResult = res.data.bizobj;

                                let strHtml = '';

                                for(var i=0;i<res.data.bizobj.length;i++){
                                      strHtml = strHtml + '<li>'+
                                                              '<a href="/#/case?medicalId='+ res.data.bizobj[i].medicalid +'">'+
                                                               '<div class="record-content">'+
                                                                   '<div class="content-top col1"><span>'+ res.data.bizobj[i].date_info[0] + '</span><span>('+ res.data.bizobj[i].date_info[1] + ')</span><span>'+ res.data.bizobj[i].date_info[2] + '</span></div>'+
                                                                   '<div class="content-bottom">'+
                                                                   '<ul>'+
                                                                       '<li><span class="f-z">'+ res.data.bizobj[i].patient_name + '</span><span class="p-c">'+ res.data.bizobj[i].patient_sex + '&nbsp;'+ res.data.bizobj[i].patient_age +'岁</span><span class="f-c">&yen;'+ res.data.bizobj[i].total_price +'</span></li>'+
                                                                       '<li><span>'+ res.data.bizobj[i].hospital +'</span><span>&nbsp;&nbsp;'+ res.data.bizobj[i].department +'</span></li>'+
                                                                       '<li><span>主治医生：'+ res.data.bizobj[i].doctor_name +'</span></li>'+
                                                                   '</ul>'+
                                                                   '</div>'+
                                                               '</div>'+
                                                               '</a>'+
                                                           '</li>';
                                }

                                $('#thelist').append(strHtml);

                                setTimeout(function() {myScroll.refresh();}, 200);

                                bzEndTime = res.data.page_info.latest_reception_time;

                                curPage++;

                                $('#thelist').attr('data-curPage', curPage);

                                maxPage > 1 ? pullUpEl.show() : pullUpEl.hide();
                           }else if(res.data.status.error_code === 2){
                                this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);

                                setTimeout(function(){
                                    window.location.href = '/#/login';
                                },3000);
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
    this.getRecordList();
  },

  mounted: function(){
    //document.addEventListener('touchmove', function(e) { e.preventDefault();}, false);

    setTimeout(this.loaded, 200);
  }
}
</script>
