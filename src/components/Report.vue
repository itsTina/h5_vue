<template>
  <div class="report">
    <header><a class="back" href="/#/my"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>
    <div class="reportbox" id="J_ReportBox">
         <div class="reporttop">
             <div class="person"><span class="place">{{reportResult.nation}}</span><span class="name">{{reportResult.patientName}}</span><span class="sex">{{reportResult.sex}}</span><span class="age" v-show="reportResult.age !== ''">{{reportResult.age}}岁</span></div>
             <div class="medicaldoctor"><span>体检医生：</span><em>{{reportResult.doctorName}}</em></div>
             <div class="medicaltime"><span>体检日期：</span><em>{{reportResult.examTime}}</em></div>
             <div class="personphone"><span>手机号码：</span><em>{{reportResult.tel}}</em></div>
         </div>
        <div class="reportcenter">
          <div class="reportdetaile" v-for="item in reportResult.report">
              <h4 class="title">{{item.itemName}}</h4>
              <div v-if="item.itemValue.hasImage" class="imgbox">
                <span class="small-imgbox J_ScaleImg" :data-size="item.itemValue.imageSize[0]" :data-src="item.itemValue.image[0]"><img :src="item.itemValue.image[0]"></span>
              </div>
              <div v-if="item.itemValue.hasTeeth">
                <div v-for="item in item.itemValue.teeth" class="ten-con">
                  <span class="tentitle">
                    <p class="small-tit">{{item.name}}</p><br>
                  </span>
                  <div class="tenimg">
                    <div class="img_center ten-img-center" id="J_Toothfour">
                        <span class="horizontal-line"></span>
                        <span class="vertical-line"></span>
                        <span class="select-area top-left J_SelectArea0">{{item.data.t_r}}</span>
                        <span class="select-area top-right J_SelectArea1">{{item.data.t_l}}</span>
                        <span class="select-area bottom-left J_SelectArea2">{{item.data.b_r}}</span>
                        <span class="select-area bottom-right J_SelectArea3">{{item.data.b_l}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="item in item.itemValue.other">
                <p class="context">{{item}}</p>
              </div>
          </div>
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

export default {
  name: 'Report',
  components: {
      MenuFooters
    },
  data () {
    return {
      msg: '体检报告',
      user:{ sid: getSid() },
      reportResult:{},
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
    getReportList: function() {
      var formData = JSON.stringify(this.user);

      axios.post(getUrl(config.url_map.list), JSON.parse(formData))
      .then((res) => {
        const { bizobj, status } = res.data;

        if (status.error_code === 0) {
          const { report } = bizobj;

          report.forEach((item) => {
            const { itemValue } = item;

            const image = [];
            const imageSize = [];
            const teeth = [];
            const other = [];

            itemValue.forEach((val) => {
              if (typeof val === 'string') {
                other.push(val);
              }

              if (typeof val === 'object') {
                const { itemCode, itemStr, attach, width, height } = val;

                // 单图片
                if (itemCode === '190' || itemCode === '195') {
                  image.push(attach);

                  imageSize.push(width + '||' + height);
                // 牙位图
                } else {
                  const { data_arr } = JSON.parse(attach)[0];

                  teeth.push({
                    name: itemStr,
                    data: data_arr
                  });
                }
              }
            });

            item.itemValue = {
              image,
              imageSize,
              teeth,
              other,
              hasImage: !!image.length,
              hasTeeth: !!teeth.length
            };
          });

          this.reportResult = res.data.bizobj;
        }else if(status.error_code === 2){
             setTimeout(function(){
                 window.location.href = '/#/login';
             },3000);

             this.errorTip($('#J_ErrorTip'),status.error_msg);
        }else{
            $('#J_ReportBox').html('<div class="empty-data"><span class="tipimg"><img src="'+ errorImgUrl +'"></span><span class="tiptext">暂时没有您的记录</span></div>');
        }
      });
    }
  },

  created: function(){
    this.getReportList();
  },

  updated: function(){
    if($('.J_ScaleImg').length){
        var items = [];

        $('.J_ScaleImg').each(function(i,n){
            $(n).attr('data-index',i);

            items.push({src: $(n).attr('data-src'),w:$(n).attr('data-size').split('||')[0],h:$(n).attr('data-size').split('||')[1]});
        });

        $('.J_ScaleImg').on('click',function(){
            var curIndex = parseInt($(this).attr('data-index'));

            var pswpElement = document.querySelectorAll('.pswp')[0];

            // define options (if needed)
            var options = {
                history: false,
                focus: false,
                showAnimationDuration: 0,
                hideAnimationDuration: 0
            };

            var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
            gallery.goTo(curIndex);
        });
    }
  }
}
</script>

