<template>
  <div class="password-container">
  	<header><a class="back" href="/#/login"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>
    <form @submit.prevent="submit">
    <ul>
    	<li><label for="J_Phone">手机号码：</label><input type="text" id="J_Phone" v-model="user.tel" v-on:blur="distributeType('phone')" placeholder="请填写手机号码"/></li>
    	<li><label for="J_Pwd">新建密码：</label><input type="password" id="J_Pwd" v-model="user.pwd" v-on:blur="distributeType('pwd')" placeholder="请填写新建密码"/></li>
    	<li><label for="J_RePwd">确认密码：</label><input type="password" id="J_RePwd" v-model="user.newpassword" v-on:blur="distributeType('rePwd')" placeholder="请填写确认密码"/></li>
    	<li><label for="J_SmsCodeNumber">图片校验码：</label><input type="text" id="J_SmsCodeNumber" v-model="user.imgcode" v-on:blur="distributeType('smsCode')" placeholder="点击图片换一换"/><span class="codeimg"><img src="" id="J_SmsValidCode" v-on:click="verifyCode"/></span></li>
        <li><label for="J_CodeNumber">短信验证码：</label><input type="text" id="J_CodeNumber" v-model="user.msgcode" v-on:blur="distributeType('code')" placeholder="请填写短信验证码"/><a href="javascript:;" class="msg" id="J_GetCode" v-on:click="getCode">获取验证码</a></li>
    	<li><div class="btn"><input type="submit" id="J_PasswordBtn" value="完成"/></div></li>
    </ul>
    </form>
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

//设置Cookie的方法集合
var Cookie = {
    add:function(name,value,expiresHours){
        var cookieString=name+"="+escape(value);

        //判断是否设置过期时间,0代表关闭浏览器时失效
        if(expiresHours>0){
            var date=new Date();
            date.setTime(date.getTime()+expiresHours*1000);
            cookieString=cookieString+";expires=" + date.toUTCString();
        }
        document.cookie=cookieString;
    },
    edit:function(name,value,expiresHours){
        var cookieString=name+"="+escape(value);
        if(expiresHours>0){
            var date=new Date();
            date.setTime(date.getTime()+expiresHours*1000); //单位是毫秒
            cookieString=cookieString+";expires=" + date.toGMTString();
        }
        document.cookie=cookieString;
    },
    get: function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr) {
            return window.unescape(arr[2]);
        }
        return '';
    }
};

//倒计时公用函数
let countdown;
var setTime = function(obj,cookieName){
    countdown = Cookie.get(cookieName);
    if (countdown == 0) {
        obj.removeClass('disabled-code');
        obj.text('获取验证码');
        return false;
    } else {
        obj.addClass('disabled-code');
        obj.text(countdown + 's后发送');
        countdown --;
        Cookie.edit(cookieName,countdown,countdown+1);
    }
    setTimeout(function(){ setTime(obj,cookieName) },1000); //每1000毫秒执行一次
};

let checkPhoneFlag = true;

export default {
  name: 'ForgotAccount',
  components: {
    MenuFooters
  },
  data () {
    return {
       msg: '忘记密码',
       user:{tel: '',pwd: '',newpassword: '',imgcode: '',msgcode: ''},
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

        validateRePwd: function($pwd, $rePwd, $tip, tip){
                var result = false;
                if($rePwd.val().length < 6 || $rePwd.val().length > 16 || /^[a-z]+$/.test($rePwd.val()) || /^[A-Z]+$/.test($rePwd.val()) || /^[0-9]+$/.test($rePwd.val()) || /^[`\!\@\#\$\%\^\&\*\(\)\-\+\=\/\.\,\?\>\<\|\\\[\]\{\}\s]+$/.test($rePwd.val())){
                    this.errorTip($tip,tip);

                    result = false;
                }else if($pwd.val() !== $rePwd.val()){
                    this.errorTip($tip,'两次密码填写不一致');

                    result = false;
                }else{
                    result = true;
                }
                return result;
            },

      validateCode: function($codeInput, $tip, tip){
          var result = false;
          if($.trim($codeInput.val()) === ''){
              this.errorTip($tip,tip);

              result = false;
          }else{
              result = true;
          }
          return result;
      },

       getImgUrl: function(){
          axios.get(getUrl(config.url_map.getImgCode))
              .then(function(res) {
                  if(res.data.status.error_code === 0){
                      $('#J_SmsValidCode').attr('src',res.data.bizobj.imgurl);
                      $('#J_SmsCodeNumber').attr('data-id',res.data.bizobj.imgid);
                  }else{
                      this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);
                  }
              }.bind(this))
              .catch(function(err) {
                console.log(err);
              });
       },

        verifyCode: function() {
          $('#J_SmsCodeNumber').val(''); // 清空原来的验证码信息

          this.getImgUrl();
        },

        getCode: function () {
              var validatePhoneFlag = this.validatePhone($('#J_Phone'),$('#J_ErrorTip'),'请填写正确的手机号码');
              if(!validatePhoneFlag){
                  return false;
              }

              var smsCodeNumberFlag = this.validateCode($('#J_SmsCodeNumber'),$('#J_ErrorTip'),'请填写正确的图片校验码');
              if(!smsCodeNumberFlag){
                  return false;
              }

              if(validatePhoneFlag && smsCodeNumberFlag){
                  if(!$('#J_GetCode').hasClass('disabled-code')){
                     $('#J_GetCode').addClass('disabled-code');

                      var formData = JSON.stringify({tel: $.trim($('#J_Phone').val()), imgcode: $.trim($('#J_SmsCodeNumber').val()),imgid:$('#J_SmsCodeNumber').attr('data-id'),msgtype:2});

                      axios.post(getUrl(config.url_map.sendMsg), JSON.parse(formData))
                          .then(function(res) {
                              if(res.data.status.error_code === 0){
                                  var forgotAccountCookieName = 'forgotAccountRemained' + $.trim($('#J_Phone').val());
                                  Cookie.add(forgotAccountCookieName, 60, 60);//添加cookie记录,有效时间60s
                                  setTime($('#J_GetCode'), forgotAccountCookieName);//开始倒计时
                              }else{
                                  this.verifyCode();
                                  this.errorTip($('#J_ErrorTip'), res.data.status.error_msg);

                                  $('#J_GetCode').removeClass('disabled-code');
                              }
                          }.bind(this))
                          .catch(function(err) {
                            console.log(err);

                            $('#J_GetCode').removeClass('disabled-code');
                          });
                  }
              }
         },

         distributeType: function(type){
            switch(type)
            {
            case 'phone':
              var phoneFlag = this.validatePhone($('#J_Phone'),$('#J_ErrorTip'),'请填写正确的手机号码');

            //手机号去重
            if(phoneFlag){
                var checkRegData = JSON.stringify({tel: this.user.tel});

                axios.post(getUrl(config.url_map.checkreg), JSON.parse(checkRegData))
                    .then(function(res) {
                        if(res.data.status.error_code === 0){
                            checkPhoneFlag = true;
                        }else{
                            this.errorTip($('#J_ErrorTip'), '手机号还没注册哦');

                            checkPhoneFlag = false;
                        }
                    }.bind(this))
                    .catch(function(err) {
                      console.log(err);
                    });
            }

              break;
            case 'pwd':
              this.validatePwd($('#J_Pwd'),$('#J_ErrorTip'),'请填写6-16位字母、数字或字符组合密码');
              break;
            case 'rePwd':
              this.validateRePwd($('#J_Pwd'),$('#J_RePwd'),$('#J_ErrorTip'),'请填写6-16位字母、数字或字符组合密码');
              break;
            case 'smsCode':
              this.validateCode($('#J_SmsCodeNumber'),$('#J_ErrorTip'),'请填写正确的图片校验码');
              break;
            case 'code':
              this.validateCode($('#J_CodeNumber'),$('#J_ErrorTip'),'请填写正确的短信验证码');
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

          if(!checkPhoneFlag){
              this.errorTip($('#J_ErrorTip'), '手机号还没注册哦');
              return false;
          }

          var validatePwdFlag = this.validatePwd($('#J_Pwd'),$('#J_ErrorTip'),'请填写6-16位字母、数字或字符组合密码');
          if(!validatePwdFlag){
              return false;
          }

          var validateRePwdFlag = this.validateRePwd($('#J_Pwd'),$('#J_RePwd'),$('#J_ErrorTip'),'请填写6-16位字母、数字或字符组合的确认密码');
          if(!validateRePwdFlag){
              return false;
          }

          var validateSmsCodeFlag = this.validateCode($('#J_SmsCodeNumber'),$('#J_ErrorTip'),'请填写正确的图片校验码');
          if(!validateSmsCodeFlag){
              return false;
          }

          var validateCodeFlag = this.validateCode($('#J_CodeNumber'),$('#J_ErrorTip'),'请填写正确的短信验证码');
          if(!validateCodeFlag){
              return false;
          }

          if(validatePhoneFlag && checkPhoneFlag && validatePwdFlag && validateRePwdFlag && validateSmsCodeFlag && validateCodeFlag){
            if(!$('#J_PasswordBtn').hasClass('disabled')){
                $('#J_PasswordBtn').addClass('disabled');

                this.user.imgid = $('#J_SmsCodeNumber').attr('data-id');
                var formData = JSON.stringify(this.user);

                axios.post(getUrl(config.url_map.retPwd), JSON.parse(formData))
                    .then(function(res) {
                        if(res.data.status.error_code === 0){
                          setTimeout(function(){
                            window.location.href = '/#/login';
                          },3000);
                        }

                        this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);

                        $('#J_PasswordBtn').removeClass('disabled');
                    }.bind(this))
                    .catch(function(err) {
                      console.log(err);

                      $('#J_PasswordBtn').removeClass('disabled');
                    });
            }
          }
        }
      },

      created: function(){
        this.getImgUrl();
      }
}
</script>

