<template>
  <div class="dashboard">
    <ModalTransmit v-if="modaltransmit" @close-modal-transmit="close"></ModalTransmit>
    <h1>WELCOME TO DEBUG LAND!</h1>
    <hr/>
    <button @click="domodal()">Show Modal!</button>
    <button @click="message=message+'A'">AddText</button>
    <hr/>
    <div>
    </div>
    <LoginForm></LoginForm>
    <TxStatus
      :datetime="new Date()"
      :info="{'line1':'TBSK/16kHz/100TICKS','line2':''}"
      :rawdata="rxresult.rawdata"
    ></TxStatus>
<!--    
    <RxStatus
      :datetime="new Date()"
      :info="{'line1':'TBSK/16kHz/100TICKS','line2':''}"
      :rawdata="rxresult.rawdata"
    ></RxStatus>
    <RxResultWindow  @close-modal-transmit="close_rxdatainfo" 
      :datetime="new Date()"
      :info="{'line1':'TBSK/16kHz/100TICKS','line2':''}"
      :rawdata="[56,57,58,56,57,58,56,57,58,56,57,58,59,56,57,58,56,57,58,56,57,58,56,57,58,59,2,60,3,4,5,6,50,56,57,58,59,2,60,3,4,5,6,50,56,57,58,59,2,60,3,4,5,6,50]"></RxResultWindow>
    <TxInputWindow  @close="close_txinput" 
    ></TxInputWindow>
-->
</div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'

import ModalTransmit from './components/ModalTransmit.vue'

import TxStatus from './components/TxStatus.vue'
import RxStatus from './components/RxStatus.vue'

import RxResultWindow from './components/window/RxResultWindow.vue'
import TxInputWindow from './components/window/TxInputWindow.vue'
export default
{
  components: {
    LoginForm,
    ModalTransmit,
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