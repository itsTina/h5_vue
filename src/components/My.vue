<template>
  <div class="operate">
    <header>{{msg}}</header>
    <div class="my-operate">

    <!--未登录-->
    <div id="J_NoLogin" class="nologin">
      <a href="/#/login">登录/注册</a>
    </div>

    <!--登录后-->
    <div id="J_Logined" class="logined" style="display:none;">
        <span class="mypic"><img :src="myInfo.headurl"></span>
        <span class="myname">{{myInfo.username}}</span>
        <span class="myphone">{{myInfo.tel}}</span>
    </div>

    <div class="operate-menu J_OperateMenu">
        <ul>
            <li>
                <a class="linkrecord" href="javascript:;" data-url="/#/record">
                    <span class="icon"><img src="../assets/my_i1.png"></span>
                    <span class="text">电子病例</span>
                </a>
            </li>
            <li>
                <a class="linkreport" href="javascript:;" data-url="/#/report">
                    <span class="icon"><img src="../assets/my_i2.png"></span>
                    <span class="text">体检报告</span>
                </a>
            </li>
            <li>
                <a class="linkmyorder" href="javascript:;" data-url="/#/myOrder">
                    <span class="icon"><img src="../assets/my_i3.png"></span>
                    <span class="text">我的预约</span>
                </a>
            </li>
            <li>
                <a class="linkcollect" href="javascript:;" data-url="javascript:;">
                    <span class="icon"><img src="../assets/my_i4.png"></span>
                    <span class="text">收藏</span>
                </a>
            </li>
        </ul>
    </div>
 </div>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import axios from 'axios';
import { setSid, getSid } from '../utils/SidManager';
import MenuFooters from './Footer';
import getConfig from '../utils/config';
import {getUrl} from '../utils/WebRequest';
var config = getConfig();
import errorImgUrl from '../assets/auto.jpg';

export default {
  name: 'My',
  components: {
    MenuFooters
  },
  data () {
    return {
      msg: '我的',
      user:{ sid: getSid() },
      myInfo:{},
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

       getMyInfo: function(){
           var formData = JSON.stringify(this.user);

           axios.post(getUrl(config.url_map.getUserInfo), JSON.parse(formData))
               .then(function(res) {
                   if(res.data.status.error_code === 0){
                       this.myInfo = res.data.bizobj;

                       if(!this.myInfo.headurl){
                        this.myInfo.headurl = errorImgUrl;
                       }

                       $('#J_NoLogin').hide();
                       $('#J_Logined').show();

                       $.each($('.J_OperateMenu a'), function(i, n){
                            $(n).attr('href',$(n).attr('data-url'));
                       });
                   }else if (res.data.status.error_code === 2){
                         $('#J_Logined').hide();
                         $('#J_NoLogin').show();

                         $('.J_OperateMenu a').attr('href','/#/login');
                   }else{
                        this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);
                   }
               }.bind(this))
               .catch(function(err) {
                 console.log(err);
               });
       }
  },

  created: function(){
     this.getMyInfo();
  }
}
</script>

