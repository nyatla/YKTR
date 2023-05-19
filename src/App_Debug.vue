<template>
  <div class="dashboard">
    <h1>WELCOME TO DEBUG LAND!</h1>
    <hr/>
    <button @click="domodal()">Show Modal!</button>
    <button @click="message=message+'A'">AddText</button>
    <hr/>
    <div>
    </div>
    <StatusDashBoard v-if="true"></StatusDashBoard>
    <LoginForm></LoginForm>

    <TxStatus
      :datetime="new Date()"
      :info="{'line1':'TBSK/16kHz/100TICKS','line2':''}"
      :rawdata="rxresult.rawdata"
    ></TxStatus>

    
</div>
</template>

<script>
import LoginForm from './components/mode/login/LoginForm.vue'

import StatusDashBoard from './components/mode/rawpacket/StatusDashboard.vue'
import TxStatus from './components/mode/rawpacket/status/TxStatus.vue'
import RxStatus from './components/mode/rawpacket/status/RxStatus.vue'

import RxResultWindow from './components/mode/rawpacket/window/RxResultWindow.vue'
import TxInputWindow from './components/mode/rawpacket/window/TxInputWindow.vue'
export default
{
  components: {
    StatusDashBoard,
    LoginForm,
    TxStatus,
    RxStatus,
    RxResultWindow,
    TxInputWindow

  },
  props: {
  },
  created() {
    let _t=this;
    let d=[56,57,58,56,57,58,56,57,58,56,57,58,59,56,57,58,56,57,5];
    setInterval(() => {
      this.rxresult.rawdata.push(d[this.rxresult.rawdata.length%d.length]);
      if(this.rxresult.rawdata.length>50){
        this.rxresult.rawdata=[];
      }
      // 5秒ごとに実行したい処理を記述
    }, 300);
  },  
  data() {
    return {
      rxresult:{
        rawdata:[],
      }
    }
  },
  methods: {
    close(){
      this.modaltransmit=false;
    },
    domodal(){
      this.modaltransmit=true;
    }
  },
}
</script>

<style lang="less" scoped>
.dashboard{
  >*{
    margin:1rem;
  }
  
}
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter-from,
  .fade-leave-to{
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from{
    opacity: 1;
  }


</style>