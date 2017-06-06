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

export default function getCookie() {
  return Cookie;
}
