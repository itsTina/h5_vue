<template>
  <div class="login-container">
  	<header><a class="back" href="/#/my"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>
  	<div class="logo"><img src="../assets/logo.png"/></div>
  	<form @submit.prevent="submit">
        <ul>
            <li><label for="J_Phone">手机号码：</label><input type="text" id="J_Phone" v-model="user.tel" v-on:blur="distributeType('phone')" placeholder="请填写手机号码"/></li>
            <li><label for="J_Pwd">密码：</label><input type="password" id="J_Pwd" v-model="user.password" v-on:blur="distributeType('pwd')" placeholder="请填写密码"/></li>
            <li><div class="t-r"><span><a href="/#/forgotAccount">忘记密码</a></span></div></li>
            <li><div class="btn"><input type="submit" id="J_LoginBtn" value="登录"/></div></li>
        </ul>
    </form>
    <div class="reg-link"><a href="/#/register">注册</a></div>
    <div id="J_ErrorTip" class="error-tip"></div>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import axios from 'axios';
import urlConfig from '../utils/urlConfig'
import { setSid, getSid } from '../utils/SidManager';
import getConfig from '../utils/config';
import {getUrl} from '../utils/WebRequest';
var config = getConfig();
import MenuFooters from './Footer'

export default {
  name: 'Login',
  components: {
      MenuFooters
    },
  data () {
    return {
      msg: '登录',
      user:{tel: '', password: ''},
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

        validatePhone: function($phone, $tip, tip) {
            var result = false;
            if ($.trim($phone.val()) === '' || !(/^(13[0-9]|14[0-9]|15[012356789]|18[0-9]|17[0-9])\d{8}$/.test($.trim($phone.val())))) {
                this.errorTip($tip, tip);

                result = false;
            } else {
                result = true;
            }
            return result;
        },

        validatePwd: function($pwd, $tip, tip){
            var result = false;
            if($pwd.val().length < 6 || $pwd.val().length > 16 || /^[a-z]+$/.test($pwd.val()) || /^[A-Z]+$/.test($pwd.val()) || /^[0-9]+$/.test($pwd.val()) || /^[`\!\@\#\$\%\^\&\*\(\)\-\+\=\/\.\,\?\>\<\|\\\[\]\{\}\s]+$/.test($pwd.val())){
                this.errorTip($tip,tip);

                result = false;
            }else{
                result = true;
            }
            return result;
        },

         distributeType: function(type){
             switch(type)
             {
             case 'phone':
               this.validatePhone($('#J_Phone'),$('#J_ErrorTip'),'请填写正确的手机号码');
               break;
             case 'pwd':
               this.validatePwd($('#J_Pwd'),$('#J_ErrorTip'),'请填写6-16位字母、数字或字符组合密码');
               break;
             default:
               break;
             }
          },

        submit: function (){
           var validatePhoneFlag = this.validatePhone($('#J_Phone'),$('#J_ErrorTip'),'请填写正确的手机号码');
            if(!validatePhoneFlag){
                return false;
            }

           var validatePwdFlag = this.validatePwd($('#J_Pwd'),$('#J_ErrorTip'),'请填写6-16位字母、数字或字符组合密码');
            if(!validatePwdFlag){
                return false;
            }

          if(validatePhoneFlag && validatePwdFlag){
            if(!$('#J_LoginBtn').hasClass('disabled')){
                $('#J_LoginBtn').addClass('disabled');

                var formData = JSON.stringify(this.user);

                axios.post(getUrl(config.url_map.login), JSON.parse(formData))
                    .then(function(res) {
                          if(res.data.status.error_code === 0){
                            setSid(res.data.bizobj.sid);

                            setTimeout(function(){
                                window.location.href = '/#/my';
                            },3000);
                          }

                          this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);

                          $('#J_LoginBtn').removeClass('disabled');
                      }.bind(this))
                    .catch(function(err) {
                      console.log(err);

                      $('#J_LoginBtn').removeClass('disabled');
                    });
            }
          }
        }
    }
}
</script>
