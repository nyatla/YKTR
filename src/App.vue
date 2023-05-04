<template>
  
  <!-- <LoginForm
    msg="Welcome to Your Vue.js App"
    @login-complete="onLoginComplete"
  /> -->
  <App_Debug v-if="false"/>
  <TimeLine v-if="state=='rawpacket'" :setting="setting" :tbsk="tbsk"  />
  <LoginForm v-if="state=='login'" @event-go="OnGo"></LoginForm>


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
    async OnGo(v){
      console.log(v);
      assert(this.state=="login");
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
