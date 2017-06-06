<template>
  <div id="J_DownLoadModule">
  <div class="downloadbox" :class="{none:isHide}">
    <span class="logo"><img src="../assets/logo.png"></span><span class="text">茄子手机客户端<br>微笑生活，一手掌握</span><a class="download" v-on:click="openclient">下载APP</a><a class="close" v-on:click="closeDownLoadbottom"><img src="../assets/closed.png"></a>
  </div>
  <div class="downloadpage" >
    <div class="downloadlayer">
      <div class="layercon">
        <div class="layerpic">
          <a v-on:click="openclient"><img src="../assets/appdownload.png"></a>
        </div>
        <div class="layerclosed"><a v-on:click="closeDownLoad"><img src="../assets/closed.png"></a></div>
      </div>
      <div class="btn"><a v-on:click="openclient">下载APP</a></div>
    </div>
  </div>
  <div class="download-preview" id="J_DownloadPreview">
    <div class="download-preview-img"><img src="http://shop.eetop.com/tpl/static/tpl/tc/img/guide.png"></div>
    <div class="download-preview-desc">
      微信用户请戳右上角按钮， 选择<img src="http://shop.eetop.com/tpl/static/tpl/tc/img/net.png">在浏览器中打开
    </div>
  </div>
  </div>
</template>
<script>
  import getBrowser from '../utils/browser'
  import getCookie from '../utils/cookie'
  import getConfig from '../utils/config'
  var config = getConfig()
  var cookie = getCookie()

  export default {
    name: 'download',
    data () {
      return {
        msg: 'download',
        isHide:true
      }
    },
    created: function () {
      var downloadapp_time = cookie.get(config.downloadCookieKey)
      //console.log('downloadapp_time is '+downloadapp_time);
      if(downloadapp_time){
        this.isHide = true;
      }else{
        this.isHide = false;
      }

    },
    methods: {
      openclient:function() {

        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        var t;
        var browser = getBrowser();

        //console.log('--mobile:'+browser.versions.mobile);
        if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面

          var isOpen = false;
          if (ua.match(/MicroMessenger/i) == "micromessenger" && (browser.versions.iPhone|| browser.versions.iPad)) {
            //在微信中打开
            isOpen = true;
          }

          if (ua.match(/WeiBo/i) == "weibo") {
            //在新浪微博客户端打开
            isOpen = true;
          }

          isOpen = false;
          if(isOpen){
            //console.log('open a new browser!');
            var $downloadPreview = $('#J_DownloadPreview');
            $downloadPreview.show();
            $downloadPreview.on('click',function(){
              $(this).hide();
            });

            return;
          }

        }

        var startTime = Date.now();

        var ifr = document.createElement('iframe');

        ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS : config.scheme_Adr;
        ifr.style.display = 'none';

        //console.log(startTime);

        if(ua.indexOf("like mac os x") > 0){//ios
          document.getElementById('J_DownLoadModule').appendChild(ifr);

          //console.log('browser is mac os');

          //ios9 document.body.appendChild(ifr);失效 单独处理
          var version;
          var version_full;
          var regStr_saf = /os [\d._]*/gi ;
          var verinfo = ua.match(regStr_saf) ;
          version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");

          var version_str = version+"";
          if(version_str != "undefined" && version_str.length >0){
            version_full=version;
            version=version.substring(0,1);

            if(version==9 || version_full>='10.'){//ios9

              window.location.href=ifr.src;
              setTimeout(function() {
                //console.log(config.download_url_ios);
                location.href = config.download_url_ios;
              }, 2000);
            }
          }

          var t = setTimeout(function() {
            var endTime = Date.now();

            //if(ua.indexOf('os') <= 0)
            //alert(download_url_ios);
            if (!startTime || endTime - startTime > config.timeout) {
              window.location = config.download_url_ios;
            }
          }, config.timeout);
          window.onblur = function() {
            clearTimeout(t);
          }
        }else{//android
          //console.log('browser is android os');
          window.location.href=ifr.src;
          setTimeout(function() {
            //console.log(config.download_url_android);
            location.href = config.download_url_android;
          }, 10);
        }
      },
      closeDownLoadbottom: function(){
        //console.log('downloadbox is hide!');
        this.isHide = true
        cookie.add(config.downloadCookieKey,'qiezi',config.downloadExpireTime);
      },
      closeDownLoad:function(){
        $('.downloadpage').hide();
      }

    }

  }
</script>

<style scoped>
  .download-preview  {display:none;position:fixed;left:0;top:0;width:100%;height:100%;background:#000;color:#fff;filter:alpha(opacity=75);opacity: .75;z-index:9999999;}
  .download-preview .download-preview-img{padding:5px 40px 10px 0;overflow:hidden;}
  .download-preview .download-preview-img img{float:right;width:30%;}
  .download-preview .download-preview-desc{padding:0 55px;font-size:16px;}
  .download-preview .download-preview-desc img{width:28px;padding:0 3px;vertical-align:bottom;}
  .none {
    display: none;
  }
</style>
