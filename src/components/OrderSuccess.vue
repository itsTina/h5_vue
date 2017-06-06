<template>
  <div class="ordersuccess-container">
  	<header>{{msg}}</header>
    <div class="empty-data"><span class="tipimg"><img src="../assets/success.png"></span><span class="tiptext">您已成功预约，<br>可用预约手机号登入<a href="/#/my">我的</a>，查看确认</span></div>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import MenuFooters from './Footer'

export default {
  name: 'OrderSuccess',
  components: {
      MenuFooters
    },
  data () {
    return {
      msg: '快速预约',
      currentMenuType: 'order',
      isHide:false
    }
  }
}
</script>



