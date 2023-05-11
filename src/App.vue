<template>
  <App_Debug v-if="false"/>
  <div class="vfullscreen" v-if="state=='login'" >
    <div>
      <LoginForm @event-go="OnGo" :application="application"></LoginForm>
    </div>
  </div>
  <div class="vfullscreen" v-if="state=='rawpacket'" >
    <div>
      <TimeLine :application="application" :tbsk="tbsk" @event-close="handleTimelineClose" />
    </div>
  </div>
</template>
<script>

const VERSION={
  name:"YKTR",
  major:0,
  miner:1,
  toString:()=>{
    return `${this.name}/${this.major}.${this.miner}`;
  }
};



import LoginForm from './components/LoginForm.vue'
import TimeLine from './components/TimeLine.vue'
import {assert,Application} from './assets/classes'
import App_Debug from './App_Debug.vue'
import {TBSKmodemJS} from "tbskmodem-js"

export default {
  name: 'App',
  components: {
    LoginForm,
    TimeLine,
    App_Debug,

  },
  props:{
    application:{
      type:Object,
      default:new Application()
    }
  },
  data() {
    return {
      tbsk:undefined,
//      setting:this.application.setting,
      state:"login",
    }
  },  
  methods: {
    async OnGo(event){
//      console.log(event);
      assert(this.state=="login");
      this.application.current_setting=event.setting;
//      console.log("setting",this.setting);
      this.state="wait_for_login";
      if(this.tbsk===undefined){
        let tbsk=await TBSKmodemJS.load();
        console.log(tbsk.version);
        this.tbsk=tbsk;
      }
      this.state="rawpacket";
//      console.log(this.state);
    },
    handleTimelineClose(event){
      this.state="login";
    }
  }  
}
</script>

<style lang="less">
@import "./assets/global.less";

.area{
  padding:0 2.5vw;
  height: 100vh;
}
.vcenter{
  .area;
  display: flex;
  justify-content: center; /* 横方向（X軸）の中央揃え */
  align-items: center; /* 縦方向（Y軸）の中央揃え */
  >:nth-child(1){
    .inherit_app_setting;
  }
}
.vfullscreen{
  .area;
  display: flex;
  justify-content: center; /* 横方向（X軸）の中央揃え */
  >:nth-child(1){
    .inherit_app_setting;
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
