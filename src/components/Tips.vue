<template>
  <div class="tips-container">
  	<header><a class="back"><div class="arrow-left"><div class="arrow"></div></div></a>{{msg}}</header>
  	<!--预约成功则去掉none，反之加上none-->
  	<div class="content none">
  		<div class="content-img">
  			<img src="../assets/success.png"/>
  		</div>
  		<div class="content-text">
  			<p>您已经成功预约，</p>
  			<p>可用预约手机号登入<span>我的</span>，查看确认</p>
  		</div>
  	</div>
  	<div class="content">
  		<div class="content-img">
  			<img src="../assets/failed.png"/>
  		</div>
  		<div class="content-text">
  			<p>暂时没有您的记录</p>
  		</div>
  	</div>
  	<footer>
        <div class="footer-container">
           <ul>
                <li>
                    <a href="###">
                      <div class="tab-img"><img src="../assets/footicon1.png"></div>
                      <div class="tab-title">预约</div>
                    </a>
                </li>
                <li>
                    <a href="###">
                      <div class="tab-img"><img src="../assets/footicon2.png"></div>
                      <div class="tab-title">话题</div>
                    </a>
                </li>
                <li class="current">
                    <a href="###">
                      <div class="tab-img"><img src="../assets/footicon3.0.png"></div>
                      <div class="tab-title">我的</div>
                    </a>
                </li>
           </ul>
        </div>
    </footer>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      msg: '提示'
    }
  }
}
</script>

