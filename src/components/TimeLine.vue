<template>
  <div class="screen" v-if="!closed">
    <div class="top_panel">
      <StatusDashboard ref="dashboardRef" :setting="setting" :activity_time_text="activity_time_text"></StatusDashboard>
    </div>
    <ul class="status-ul">
      <template v-for="(status, index) in statuses" :key="status.sid">        
        <li>
          <KeepAlive>
            <component
              :is="status.type === 'tx'?'TxStatus':'RxStatus'"
              :ref="(el)=>{status.ref=el}" :status="status" @event-click="OnStatusClick">
            </component>
          </KeepAlive>
        </li>
      </template>
        <!-- <li v-for="(status, index) in statuses" :key="status.sid">
          <RxStatus v-if="status.type == 'rx'" :status="status" @event-click="OnRxClick"></RxStatus>
          <TxStatus v-else-if="status.type == 'tx'" :status="status" @event-click="OnTxClick"></TxStatus>
        </li> -->
    </ul>
    <div class="footer_shadow"></div>
    <div class="footer_panel">
      <button @click="OnBackClick">Back</button>
      <button @click="OnNewTxClick">Transmit</button>
    </div>
    <ModalFrame v-if="modal=='rx'">
      <RxResultWindow  :status="selected_rx_status" @event-close="OnModalClose"></RxResultWindow>
    </ModalFrame>
    <ModalFrame v-if="modal=='tx'">
      <TxResultWindow  :status="selected_tx_status" @event-close="OnModalClose"></TxResultWindow>
    </ModalFrame>
    <ModalFrame v-if="modal=='newtx'">
      <TxInputWindow  :setting="setting" @event-transmit="OnTransmit" @event-close="OnModalClose"></TxInputWindow>
    </ModalFrame>


  </div>
</template>



  
<script>
import {assert,BrokenCodeText} from "../assets/classes"
import RxStatus from './status/RxStatus.vue';
import TxStatus from './status/TxStatus.vue';
import StatusDashboard from './StatusDashboard.vue';
import RxResultWindow from './window/RxResultWindow.vue';
import TxResultWindow from './window/TxResultWindow.vue';
import TxInputWindow from './window/TxInputWindow.vue';
import ModalFrame from './ctrl/ModalFrame.vue';

class Stopwatch {
  constructor() {
    this.startTime = null;
    this.stopTime = null;
    this.running = false;
  }

  start() {
    if (!this.running) {
      this.startTime = Date.now();
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      this.stopTime = Date.now();
      this.running = false;
    }
  }

  getElapsedTime() {
    if (this.startTime === null) {
      return 0;
    }
    if (this.running) {
      return Date.now() - this.startTime;
    } else {
      return this.stopTime - this.startTime;
    }
  }
  get hhmmssText(){
    if (this.startTime === null) {
      throw new Error();
    }
    const elapsed = this.running ? Date.now() - this.startTime : this.stopTime - this.startTime;
    const hours = Math.floor(elapsed / 3600000); // 1時間は 3600000 ミリ秒
    const minutes = Math.floor((elapsed - hours * 3600000) / 60000); // 1分は 60000 ミリ秒
    const seconds = Math.floor((elapsed - hours * 3600000 - minutes * 60000) / 1000); // 1秒は 1000 ミリ秒
    const pad = (num) => String(num).padStart(2, '0'); // 数字を2桁の文字列に変換する関数
    return `${hours>99?hours:pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  reset() {
    this.startTime = null;
    this.stopTime = null;
    this.running = false;
  }
}

export default {
  components: {
    RxStatus,
    TxStatus,
    StatusDashboard,
    RxResultWindow,
    TxResultWindow,
    TxInputWindow,
    ModalFrame
  },
  props: {
    
    application:{
      type:Object,
      required:true
    },
    tbsk: Object,//TBSKmodemJSインスタンス
  },


  data() {
    return {
      _rms:0,
      _stopwatch:undefined,
      _timer:undefined,
      modal:undefined,
      activity_time_text:"",
      title: "TBSK Audio Terminal",
      setting:this.application.current_setting,
      statuses:[],//watachに引っかけるためにapplicationと並列のリストにする。外部での配列操作はフックできない。
      selected_sid:undefined, //操作対象のsid
      active_rx_sid: undefined,//アクティブなRX
      active_tx_sid: undefined,//アクティブなRX
      closed: false
    }
  },
  async mounted()
  {
    let _t = this;
    const tbsk=this.tbsk;
    const setting=this.setting;
    let tone=setting.tone.createInstance(tbsk);

    
    let socket = new tbsk.misc.TbskSocket({
      carrier: setting.frequency.freq,
      tone:tone,
      encoding: "bin" 
    });
    tone.dispose();//参照をコピーされるからもういらない。
    socket.addEventListener("open", () => {
      console.log("Socket open!\n");
    });
    socket.addEventListener("detected", (event) => { _t.detected(event); });
    socket.addEventListener("message", (event) => { _t.message(event); });
    socket.addEventListener("lost", (event) => { _t.lost(event); });
    socket.addEventListener("sendstart",(event)=>{_t.sendstart(event);});
    socket.addEventListener("sendcompleted",(event)=>{_t.sendcompleted(event);});
    //socket.addEventListener("close",(event)=>{console.log("closed!\n");});
    await socket.waitOpenAS();
    let stopwatch=new Stopwatch();
    stopwatch.start();
    this._timer=setInterval(()=>{
      _t.activity_time_text=stopwatch.hhmmssText;
      _t.$refs.dashboardRef.setRms(socket.rms);
    },30);
    this._stopwatch=stopwatch;
    this._socket = socket;
    //アプリケーションデータから復帰
    for(let i of this.application.statuses.items){
      this.statuses.unshift(i);
    }
  },
  created() {

  },
  async beforeUnmount() {
    clearInterval(this._timer);
    this._socket.close();
    //closeに時間かかるかも。
    return this._socket.waitCloseAS();//Promise
  },
  computed:{
    selected_rx_status(){
      let status = this.application.statuses.statusOfSid(this.selected_sid);
      assert(status && status.type=="rx");
      return status;
    },
    selected_tx_status(){
      let status = this.application.statuses.statusOfSid(this.selected_sid);
      assert(status && status.type=="tx");
      return status;
    }
  },
  methods: {
    _statusOfSid(sid,type=undefined){
      let status = this.statuses.find(item => item.sid == sid);
      if(status && (type===undefined || status.type==type)){
        return status;
      }
      return undefined;
    },
    _addNewTx(data){
      let ts=this.application.statuses.newTx(this.application.current_setting);
      ts.rawdata=data;
      this.statuses.unshift(ts);//表示にも書込み
      return ts;
    },
    _addNewRx(data){
      let ts=this.application.statuses.newRx(this.application.current_setting);
      this.statuses.unshift(ts);//表示にも書込み
      return ts;
    },
    OnStatusClick(event){
      console.log("selected",event);
      switch(event.type){
        case "rx":
          this.selected_sid=event.sid;
          this.modal="rx";
          break;
        case "tx":
          this.selected_sid=event.sid;
          this.modal="tx";
          break;
        default:
          throw new Error();
      }
    },
    OnNewTxClick(event){
      this.modal="newtx";
    },
    async OnBackClick(event){
      await this.close();
    },
    OnTransmit(event){
      let ts=this._addNewTx(event.data);
      this.active_tx_sid=ts.sid;
      this.modal="";
      //レンダリングを待つのだ。
      this.$nextTick(()=>{
        ts.ref.setMessage("Modulating");
        this._socket.send(ts.rawdata);
      });
    },
    async OnModalClose(event){
      this.modal="";
    },
    sendstart(event){
      let status = this._statusOfSid(this.active_tx_sid);
      status.ref.setMessage("Transmiting");
    },
    sendcompleted(event){
      let status = this._statusOfSid(this.active_tx_sid);
      status.ref.setMessage("Completed");
      //
      let bct=new BrokenCodeText();
      bct.update(status.rawdata);
      let message=[...bct.fixed];
      message.push(...bct.unfixed);
      console.log("sendcomplete",message);
      setTimeout(()=>{
        status.ref.setTxData(message);
        status.fixed=true;
      },500);
    },
    async close() {
      this.modal="";//modalのクローズ
      this._socket.close();
      await this._socket.waitCloseAS();
      this.$emit("event-close");
    },
    // eslint-disable-next-line no-unused-vars
    detected(event)
    {
      console.log("detected",event.id);
      let rs=this._addNewRx();
      this.active_rx_sid = rs.sid;
    },
    // eslint-disable-next-line no-unused-vars
    message(event) {
      let status = this._statusOfSid(this.active_rx_sid);
      let n=[];
      for(let i of event.data){
        status.rawdata.push(i);
        n.push(i);
      }
      status.cache._dec.update(n);
      if(status.ref){
        status.ref.update();
      }
    },
    // eslint-disable-next-line no-unused-vars
    lost(event) {
      let status = this._statusOfSid(this.active_rx_sid);
      status.fixed=true;
      this.active_rx_sid=undefined;
      if(status.ref){
        status.ref.update();
      }else{
        this.$nextTick(()=>{status.ref.update();});
      }
    },
  }
}
</script>
  
<style lang="less" scoped>
  @import "../assets/global.less";


  
.screen{
}

.status-ul {
  z-index: 1;
  list-style: none;
  margin: 6rem 0 0 0;
  padding: .25rem 0 0 0;
  >li {
    padding-bottom:.25rem;
  }
//  background-color: @light-gray;
  height: 100%;
  min-height: 10rem;
  padding-bottom: 5rem;
}

.top_panel{
  .inherit_app_setting;
  z-index: 2;
  position: fixed;
  height:6rem;
  top:0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 1) 100%);
}
.footer_base{
  .inherit_app_setting;
  position: fixed;
  height:5rem;
  bottom: 0;
}
.footer_shadow{
  .footer_base;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 1) 100%);
}

.footer_panel{
  .footer_base;
  background-color: transparent;

  >button{
    font-size: 1.5rem;
    width:8rem;
    margin:1rem;
  }
}

</style>