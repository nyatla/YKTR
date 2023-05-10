<template>
  <div class="timeline" v-if="!closed">
    <div class="top_panel">
      <StatusDashboard ref="dashboardRef" :setting="setting" :activity_time_text="activity_time_text"></StatusDashboard>
    </div>
    <ul class="status-ul">
        <li v-for="(status, index) in statuses" :key="status.sid">
          <RxStatus v-if="status.type == 'rx'" :status="status" @event-click="OnRxClick"></RxStatus>
          <TxStatus v-if="status.type == 'tx'" :info="active_tx_info" :status="status" @event-click="OnTxClick"></TxStatus>
        </li>
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
import {DEFAULT_SETTING,StatusDataBuilder,assert,dbg} from "../assets/classes"
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
    
    setting:{
      type:Object,
      default:DEFAULT_SETTING
    },
    tbsk: Object,//TBSKmodemJSインスタンス
  },


  data() {
    return {
      status_builder:new StatusDataBuilder(),
      _rms:0,
      _stopwatch:undefined,
      _timer:undefined,
      modal:undefined,
      activity_time_text:"",
      title: "TBSK Audio Terminal",
      statuses: [
      ],
      selected_sid:undefined, //操作対象のsid
      active_rx_sid: undefined,//アクティブなRX
      active_tx_sid: undefined,//アクティブなRX
      active_tx_info:{
        message:"",//状態を表示するメッセージ"Modulating→Transmitting→Completed!"
        estimated_transmit_time:0,//推定送信時間
      },
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


    

  },
  created() {

  },
  beforeUnmount() {
    clearInterval(this._timer);
    this._socket.close();
    //closeに時間かかるかも。
    return this._socket.waitCloseAS();//Promise
  },
  computed:{
    selected_rx_status(){
      let status = this.statuses.find(item => item.sid == this.selected_sid);
      assert(this.selected_sid!=undefined && status.type=="rx");
      return status;
    },
    selected_tx_status(){
      let status = this.statuses.find(item => item.sid == this.selected_sid);
      assert(this.selected_sid!=undefined && status.type=="tx");
      return status;
    }
  },
  methods: {
    OnRxClick(event){
      this.selected_sid=event.sid;
      this.modal="rx";
      console.log("selected",event);
    },
    OnTxClick(event){
      this.selected_sid=event.sid;
      this.modal="tx";
      console.log("selected",event);
    },
    OnNewTxClick(event){
      this.modal="newtx";
    },
    async OnBackClick(event){
      await this.close();
    },
    OnTransmit(event){
      let data=event.data;
      let ts=this.status_builder.newTx();
      ts.rawdata=data;
      this.active_tx_sid=ts.sid;
      this.statuses.unshift(ts);
      this.active_tx_info.message="Modulating";
      this._socket.send(ts.rawdata);
      this.modal="";
      console.log(this.active_tx_info);
    },
    async OnModalClose(event){
      this.modal="";
    },
    sendstart(event){
//      let status = this.statuses.find(item => item.sid == this.active_tx_sid);
      this.active_tx_info.message="Transmiting";//微妙。
    },
    sendcompleted(event){
      let status = this.statuses.find(item => item.sid == this.active_tx_sid);
      this.active_tx_info.message="Completed";//微妙。
      status.fixed=true;
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
      let rs=this.status_builder.newRx();
      this.active_rx_sid = rs.sid;
      this.statuses.unshift(rs);
    },
    // eslint-disable-next-line no-unused-vars
    message(event) {
      let status = this.statuses.find(item => item.sid == this.active_rx_sid);
      let n=[];
      for(let i of event.data){
        status.rawdata.push(i);
        n.push(i);
      }
      status.cache._dec.update(n);
    },
    // eslint-disable-next-line no-unused-vars
    lost(event) {
      let status = this.statuses.find(item => item.sid == this.active_rx_sid);
      status.fixed=true;
      this.active_rx_sid=undefined;
    },/*
      send(){
        //受信中なら閉じる
        //送信ステータスを開く
      },
      send_close(force){
        //送信ステータスを閉じる
        //待機ステータスを開く
      },*/
    //アイドル状態にする
    // idle(){
    //   this.append("idle");
    // }

  }
}
</script>
  
<style lang="less" scoped>
  @import "../assets/global.less";

.inherit_app_setting{
  //ここの設定はApp.vueからコピーして
  width:95vw;
  min-width:20rem;
  max-width:40rem;

}
.timeline{
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