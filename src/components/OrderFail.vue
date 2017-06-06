<template>
  <div class="orderfail-container">
  	<header>{{msg}}</header>
    <div class="empty-data"><span class="tipimg"><img src="../assets/failed.png"></span><span class="tiptext">抱歉，当前网络拥堵，请稍后重试</span></div>
    <MenuFooters :isHide="isHide" :menuType="currentMenuType"></MenuFooters>
  </div>
</template>
<script>
import MenuFooters from './Footer'

export default {
  name: 'OrderFail',
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



