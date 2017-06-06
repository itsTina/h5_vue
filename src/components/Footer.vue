<template>
  <div class="footer" :class="{none:isHide}">

    <footer>
        <div class="footer-container" >
           <ul>
                <li :class="{current:menuType1Selected}">
                      <router-link to="/">
                      <div class="tab-img">
                        <div v-if="menuType1Selected">
                          <img src="../assets/footicon1.0.png">
                        </div>
                        <div v-else>
                          <img src="../assets/footicon1.png">
                        </div>
                      </div>
                      <div class="tab-title">预约</div>
                      </router-link>
                </li>
                <li :class="{current:menuType2Selected}">
                  <router-link to="/topic">
                      <div class="tab-img">
                        <div v-if="menuType2Selected">
                          <img src="../assets/footicon2.0.png">
                        </div>
                        <div v-else>
                          <img src="../assets/footicon2.png">
                        </div>
                      </div>
                      <div class="tab-title">话题</div>
                  </router-link>
                </li>
                <li :class="{current:menuType3Selected}">
                  <router-link to="/my">
                      <div class="tab-img" >

                        <div v-if="menuType3Selected">
                          <img src="../assets/footicon3.0.png">
                        </div>
                        <div v-else>
                          <img src="../assets/footicon3.png">
                        </div>

                      </div>
                      <div class="tab-title">我的</div>
                  </router-link>
                </li>
           </ul>
        </div>
    </footer>
  </div>
</template>
<script>
export default {
  name: 'footer',
  props: ['menuType','isHide'],
  data () {
    return {
      msg: 'footer'
    }
  },
  created: function () {
    // `this` 指向 vm 实例
    //console.log('menuType is: ' + this.menuType)
  },
  computed:{
    menuType1Selected(){
      return this.menuType=='order';
    },
    menuType2Selected(){
      return this.menuType=='topic';
    },
    menuType3Selected(){
      return this.menuType=='my';
    }
  }
}
</script>

<style scoped>
  .none {
    display: none;
  }

</style>
