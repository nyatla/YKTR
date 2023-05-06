<template>
  
  <!-- <LoginForm
    msg="Welcome to Your Vue.js App"
    @login-complete="onLoginComplete"
  /> -->
  <App_Debug v-if="false"/>
  <div class="vcenter" v-if="state=='login'" >
    <div>
      <LoginForm @event-go="OnGo"></LoginForm>
    </div>
  </div>
  <div class="vfullscreen" v-if="state=='rawpacket'" >
    <div>
      <TimeLine  :setting="setting" :tbsk="tbsk"  />
    </div>
  </div>




</template>

<script>
import LoginForm from './components/LoginForm.vue'
import TimeLine from './components/TimeLine.vue'



import {assert,DEFAULT_SETTING} from './assets/classes'
import App_Debug from './App_Debug.vue'
import {TBSKmodemJS} from "tbskmodem-js"

export default {
  name: 'App',
  components: {
    LoginForm,
    TimeLine,
    App_Debug,

  },

  data() {
    return {
      tbsk:undefined,
      setting:DEFAULT_SETTING,
      state:"login",
    }
  },  
  methods: {
    async OnGo(event){
      console.log(event);
      assert(this.state=="login");
      this.setting=event.setting;
      this.state="wait_for_login";
      let tbsk=await TBSKmodemJS.load();
      console.log(tbsk.version);
      this.tbsk=tbsk;
      this.state="rawpacket";
      console.log(this.state);
    },
  }  
}
</script>

<style lang="less">
.area{
  padding:0 2.5vw;
  height: 100vh;
  // min-width:20rem;
  // max-width:40rem;
}
.vcenter{
  .area;
  display: flex;
  justify-content: center; /* 横方向（X軸）の中央揃え */
  align-items: center; /* 縦方向（Y軸）の中央揃え */
  >:nth-child(1){
    width:95vw;
    min-width:20rem;
    max-width:40rem;
  }
}
.vfullscreen{
  .area;
  display: flex;
  justify-content: center; /* 横方向（X軸）の中央揃え */
  >:nth-child(1){
    width:95vw;
    min-width:20rem;
    max-width:40rem;
  }
}

html,body{
  height:100%;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
