<template>
  
  <!-- <LoginForm
    msg="Welcome to Your Vue.js App"
    @login-complete="onLoginComplete"
  /> -->
  <button @click="onStartApplication(16000)">OPEN WEB</button>
  <TimeLine v-if="state=='timeline'" :tbsk="tbsk" :params="sock_params"  />

</template>

<script>
//import LoginForm from './components/LoginForm.vue'
import TimeLine from './components/TimeLine.vue'

import {TBSKmodemJS} from "tbskmodem-js"

export default {
  name: 'App',
  components: {
//    LoginForm,
    TimeLine
  },
  data() {
    return {
      tbsk:undefined,
      sock_params:{
        frequency:16000,
        tone:undefined
      },
      state:"login",

    }
  },  
  methods: {
    onStartApplication(freq){
      const _t=this;
      function init(){
        _t.state="timeline";
      }
      if(_t.tbsk===undefined){
        console.log(TBSKmodemJS);
        TBSKmodemJS.load().then((tbsk)=>{
          console.log(tbsk.version);
          _t.tbsk=tbsk;
          _t.sock_params={
            frequency:freq,
            tone:undefined};
          init();
        });
      }else{
        init();
      }
    }
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
