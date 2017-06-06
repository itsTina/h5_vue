var config = {
  /*scheme:*/
  scheme_IOS: 'eetopin://aa.bb:80/test?d=&parentHospitalId=&hospitalId=&hospitalName=',
  scheme_Adr: 'eetopin://aa.bb:80/test?d=&parentHospitalId=&hospitalId=&hospitalName=',
  download_url_android: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cn.tc.client.eetopin',
  //download_url_ios: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cn.tc.client.eetopin',
  download_url_ios:'itms-apps://itunes.apple.com/us/app/ji-wai/id726980709?mt=8',
  timeout: 600,
  downloadExpireTime: 86400, //second
  downloadCookieKey: 'downloadapp_time', //second
  //api_url:'http://www.h5api.com/',
  api_url:'http://h5api.eetopintest.com/',
  /*api 字典*/
  url_map:{
    topicInfo:'qiezi/topic/detail',
    commentList:'qiezi/topic/comment',
    topicList:'qiezi/topic/list',
    login:'qiezi/user/login',
    getUserInfo:'qiezi/user/getUserInfo',
    getApotList:'his/appointment/getApotList',
    getMedicalList:'his/medical/getMedicalList',
    list:'his/report/list',
    queryHospitals:'his/appointment/queryHospitals',
    getImgCode:'qiezi/user/getImgCode',
    time:'qiezi/user/time',
    addAppointApply:'his/appointment/addAppointApply',
    sendMsg:'qiezi/user/sendMsg',
    checkreg:'qiezi/user/checkreg',
    retPwd:'qiezi/user/retPwd',
    register:'qiezi/user/register',
    getMedicalDetails:'his/medical/getMedicalDetail'
  }
};

export default function getConfig() {
  return config;
}
