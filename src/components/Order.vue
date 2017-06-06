<template>
  <div class="order-container">
  	<header>{{msg}}</header>
  	<div class="formbox">
    <form @submit.prevent="submit">
    <ul>
    	<li>
    	<label>离我最近：</label>
    	<select id="J_HospitalList">
            <option v-for="item in hospitalItems" :value="item.hospitalid">{{item.hospitalname}}</option>
    	</select>
    	</li>
    	<li><label>就医时间：</label><input type="text" id="J_Date" value="" placeholder="请点击选择就医时间" readonly onfocus="javascript:this.blur();"/></li>
    	<li><label for="J_Name">真实姓名：</label><input type="text" id="J_Name" v-model="user.patientname" v-on:blur="distributeType('name')" placeholder="用于就诊信息调用,务必正确填写"/></li>
    	<li><label for="J_Phone">手机号码：</label><input type="text" id="J_Phone" v-model="user.tel" v-on:blur="distributeType('phone')" placeholder="请填写手机号码"/></li>
    	<li><label for="J_SmsCodeNumber">图片校验码：</label><input type="text" id="J_SmsCodeNumber" v-model="user.imgcode" v-on:blur="distributeType('smsCode')" placeholder="点击图片换一换"/><span class="codeimg"><img src="" id="J_SmsValidCode" v-on:click="verifyCode"/></span></li>
    	<li><div class="btn"><input type="submit" id="J_OrderBtn" value="预约"/></div></li>
    </ul>
    </form>
 </div>
    <DownloadApp></DownloadApp>

    <div id="J_ErrorTip" class="error-tip"></div>
    <el-amap :plugin="plugin"></el-amap>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>

  </div>
</template>
<script>
import Vue from 'vue';
import AMap from 'vue-amap';
import axios from 'axios';
import getDistance from '../utils/getDistance';
import getConfig from '../utils/config';
import {getUrl} from '../utils/WebRequest';
import DownloadApp from './DownloadApp';
var config = getConfig();
import MenuFooters from './Footer'

Vue.use(AMap);

AMap.initAMapApiLoader({
  key: 'df4372c4f529935ef7f8924b44ae3d7b',
  plugin: ['AMap.Geolocation']
});

export default {
  name: 'Order',
  components: {
      DownloadApp,
      MenuFooters
    },
  data () {
    const self = this;

    return {
      msg: '快速预约',
      currentMenuType: 'order',
      isHide:false,
      user:{ patientname: '', tel: '', imgcode: '' },
      hospitalid: '',
      hospitalItems: [],
      plugin: [{
                  pName: 'Geolocation',
                  events: {
                      init(o) {
                           o.getCurrentPosition((status, result) => {
                             const { position } = result;

                             self.getNearestHospital(position);
                          });
                      }
                  }
              }]
    }
  },

  methods: {
            getHospitalList: function() {
                return new Promise((resolve, reject) => {
                  axios.get(getUrl(config.url_map.queryHospitals))
                    .then((res) => {
                      const { bizobj, status } = res.data;
                      const { error_code, error_msg } = status;

                      if (error_code === 0) {
                        resolve(bizobj);
                      } else {
                        reject(error_msg);
                      }
                    });
                });
              },

            getNearestHospital: function(position) {
              const { lng, lat } = position;

              this.getHospitalList()
                .then((hospitalList) => {
                  this.hospitalItems = hospitalList;

                  const distanceArr = hospitalList.map((hospital) => {
                    const { longitude, latitude } = hospital;

                    return getDistance(lng, lat, longitude, latitude);
                  });

                  const nearest = Math.min.apply(null, distanceArr);
                  const nearestHospital = hospitalList[distanceArr.indexOf(nearest)];

                  this.setDefaultHospital(nearestHospital);
                });
            },

            initHospitalSelect: function() {
              const $hospitalList = $('#J_HospitalList');

              $hospitalList.mobiscroll().select({
                theme: 'android-holo-light',
                mode: 'scroller',
                display: 'bottom',
                lang: 'zh'
              });
            },

            setDefaultHospital: function(hospital) {
              const $hospitalList = $('#J_HospitalList');
              const $hospitalListDummy = $('#J_HospitalList_dummy');

              const { hospitalid, hospitalname } = hospital;

              $hospitalListDummy.val(hospitalname);

              setTimeout(() => {
                $('option', $hospitalList).each(function() {
                  const $this = $(this);

                  if ($this.val() === hospitalid) {
                    $this.prop('selected', true);
                  }
                });

                this.initHospitalSelect();
              }, 1);
            },

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

          getStrLen: function(str){
              return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
          },

          validateName: function($name, $tip, flag){
              var result = false;
              if($.trim($name.val()) === '' || !(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test($.trim($name.val())))){
                  var tip = '';
                  if(flag === 'realName'){
                      tip = '姓名为数字、字母或中文';
                  }else{
                      tip = '昵称为数字、字母或中文';
                  }

                  this.errorTip($tip,tip);

                  result = false;
              }else if(this.getStrLen($.trim($name.val())) > 15){
                  var tip = '';
                  if(flag === 'realName'){
                      tip = '姓名最多15个字符';
                  }else{
                      tip = '昵称最多15个字符';
                  }

                  this.errorTip($tip,tip);

                  result = false;
              }else{
                  result = true;
              }
              return result;
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

           distributeType: function(type){
              switch(type)
              {
              case 'name':
                this.validateName($('#J_Name'),$('#J_ErrorTip'),'realName');
                break;
              case 'phone':
                this.validatePhone($('#J_Phone'),$('#J_ErrorTip'),'请填写正确的手机号码');
                break;
              case 'smsCode':
                this.validateCode($('#J_SmsCodeNumber'),$('#J_ErrorTip'),'请填写正确的图片校验码');
                break;
              default:
                break;
              }
           },

          getMaxMonth: function(date, value){
            date.setMonth(date.getMonth() + value);

            return date;
          },

          getCurTime: function(){
            axios.get(getUrl(config.url_map.time))
                .then(function(res) {
                      if(res.data.status.error_code === 0){
                            let curTime = res.data.bizobj.time;

                            let startTime = new Date(curTime).getTime() + 2 * 24 * 60 * 60 * 1000;

                            let endTime = this.getMaxMonth(new Date(curTime), 1).getTime();

                            $('#J_Date').mobiscroll().date({
                              theme: 'android-holo-light',
                              mode: 'scroller',
                              display: 'bottom',
                              lang: 'zh',
                              minDate: new Date(startTime),
                              maxDate: new Date(endTime)
                            });
                      }else{
                          this.errorTip($('#J_ErrorTip'),res.data.status.error_msg);
                      }
                  }.bind(this))
                  .catch(function(err) {
                    console.log(err);
                  });
          },

          submit: function (){
            var validateDateFlag = this.validateCode($('#J_Date'),$('#J_ErrorTip'),'请选择就医时间');
            if(!validateDateFlag){
                return false;
            }

            var validateNameFlag = this.validateName($('#J_Name'),$('#J_ErrorTip'),'realName');
            if(!validateNameFlag){
                return false;
            }

            var validatePhoneFlag = this.validatePhone($('#J_Phone'),$('#J_ErrorTip'),'请填写正确的手机号码');
            if(!validatePhoneFlag){
                return false;
            }

            var validateSmsCodeFlag = this.validateCode($('#J_SmsCodeNumber'),$('#J_ErrorTip'),'请填写正确的图片校验码');
            if(!validateSmsCodeFlag){
                return false;
            }

            if(validateDateFlag && validateNameFlag && validatePhoneFlag && validateSmsCodeFlag){
              if(!$('#J_OrderBtn').hasClass('disabled')){
                $('#J_OrderBtn').addClass('disabled');

                this.user.hospitalid = $('#J_HospitalList').val();
                this.user.expecttime = $('#J_Date').val();
                this.user.imgid = $('#J_SmsCodeNumber').attr('data-id');

                var formData = JSON.stringify(this.user);

               axios.post(getUrl(config.url_map.addAppointApply), JSON.parse(formData))
                  .then(function(res) {
                        if(res.data.status.error_code === 0){
                            $('#J_Phone').val('');

                            window.location.href = '/#/orderSuccess';
                        }else if(res.data.status.error_code === 3){
                            this.errorTip($('#J_ErrorTip'), '图片校验码有误');
                        }else{
                            $('#J_Phone').val('');

                            window.location.href = '/#/orderFail';
                        }

                        $('#J_OrderBtn').removeClass('disabled');
                    }.bind(this))
                  .catch(function(err) {
                    console.log(err);

                    $('#J_OrderBtn').removeClass('disabled');
                  });
              }
            }
          }
        },

        created: function(){
          this.getImgUrl();

          this.getCurTime();
        },

        mounted: function(){
          const $hospitalListDummy = $('#J_HospitalList_dummy');

          $hospitalListDummy.attr('placeholder','正在定位,请稍后...');
        }
}
</script>
