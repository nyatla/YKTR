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
  <ModalFrame v-if="state=='warn_ios'">
    <WarningIos :application="application" @event-close="OnCloseWarning"></WarningIos>
  </ModalFrame>

</template>
<script>


function getiOSVersion(){
    return parseFloat(
        ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
        .replace('undefined', '3_2').replace('_', '.').replace('_', '')
    ) || false;
}

import img_logo from '@/assets/icon256.png'
import WarningIos from './components/window/WarningIos.vue'
import ModalFrame from './components/ctrl/ModalFrame.vue'

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
    WarningIos,
    ModalFrame,

  },
  props:{
    application:{
      type:Object,
      default:new Application(
        {
          imgs:{
            logo:img_logo
          }
        }
      )
    }
  },
  data() {
    return {
      tbsk:undefined,
      state:"login",
    }
  },  
  methods: {
    OnCloseWarning(event){
      this.application.env.dont_show_again_ios_warn=event.dont_show_again;
      this.state="rawpacket";
    },
    async OnGo(event){
      assert(this.state=="login");
      this.application.current_setting=event.setting;
      this.state="wait_for_login";
      if(this.tbsk===undefined){
        let tbsk=await TBSKmodemJS.load();
        console.log(tbsk.version);
        this.tbsk=tbsk;
      }
      let warn=this.application.env.dont_show_again_ios_warn;
      if(getiOSVersion()!==false && (warn===undefined||warn===false)){
        this.state="warn_ios";
      }else{
        this.state="rawpacket";
      }
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
