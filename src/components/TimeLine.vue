<template>
  <div class="timeline" v-if="!closed">
    <div class="top_panel">
      <StatusDashboard ref="dashboardRef" :setting="setting" :activity_time_text="activity_time_text" @debug="debug"></StatusDashboard>
    </div>
    <ul class="status-ul">
        <li v-for="(status, index) in statuses" :key="index">
            <RxStatus v-if="status.type == 'rx'" :datetime="status.datetime" :rawdata="status.rawdata" :fixed="status.fixed"></RxStatus>
        </li>
        <li v-for="index in 20">
          <RxStatus  :rawdata="[55,56,57]" :fixed="false"></RxStatus>
        </li>

    </ul>
    <div class="footer_shadow"></div>
    <div class="footer_panel">
      <button>Back</button>
      <button>Transmit</button>
    </div>

  </div>
</template>



  
<script>
import {DEFAULT_SETTING} from "../assets/classes"
import RxStatus from './RxStatus.vue';
import StatusDashboard from './StatusDashboard.vue';


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





let DBG_DATA = [56, 58, 57, 2, 0x88, 88, 5, 8, 0xe3, 0x81, 0x82, 56, 56, 56, 56, 56, 56, 56, 66, 24, 58, 56];
let dbg_c = 0;
function dbgstream() {
  return DBG_DATA[(dbg_c++) % DBG_DATA.length];
}
export default {
  components: {
    RxStatus,
    StatusDashboard
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
      _rms:0,
      _stopwatch:undefined,
      _timer:undefined,
      activity_time_text:"",
      title: "TBSK Audio Terminal",
      statuses: [
        // {
        //   sid:0,
        //   type:"rx",
        //   rawdata:[]
        // }
      ],
      sid_counter: 0,        //sidの通し番号
      current_sid: undefined,//操作対象のsid
      closed: false
    }
  },
  async mounted()
  {
    let _t = this;
    const tbsk=this.tbsk;
    const setting=this.setting;
    let tone;
    switch(setting.tone[0]){
    case 'SIN':
      tone=new tbsk.SinTone(setting.tone[1].points,setting.tone[1].cycle);
      break;
    case 'XPSK':
      tone=new tbsk.SinTone(setting.tone[1].points,setting.tone[1].cycle,setting.tone[1].div);
      break;
    default:
      throw new Error("Invalid tone",tone);
    }
    let socket = new this.tbsk.misc.TbskSocket({
      carrier: setting.frequency[1]["freq"],
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
    // socket.addEventListener("sendstart",(event)=>{console.log("TX:("+event.id+")");});
    // socket.addEventListener("sendcompleted",(event)=>{console.log("done\n");});
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
  beforeUnmount(){
    clearInterval(this._timer);
  },  
  created() {

  },
  beforeUnmount() {
    this._socket.close();
    //closeに時間かかるかも。
    return this._socket.waitCloseAS();//Promise
  },
  methods: {
    debug(type) {
      console.log(type);
      switch (type) {
        case "detect":
          this.detected();
          break;
        case "message":
          this.message(dbgstream());
          break;
        case "lost":
          break;
      }
    },
    close() {
      this._socket.close();
    },    
    // eslint-disable-next-line no-unused-vars
    detected(event)
    {
      console.log("detected",event.id);
      this.current_sid = this.sid_counter;
      this.sid_counter++;
      this.statuses.push(
        {
          sid: this.current_sid,
          datetime:new Date(),
          type: "rx",
          rawdata: [],
          fixed: false,
        });
    },
    // eslint-disable-next-line no-unused-vars
    message(event) {
      let status = this.statuses.find(item => item.sid == this.current_sid);
      for(let i of event.data){
        status.rawdata.push(i);
      }
      console.log(event.data);
    },
    // eslint-disable-next-line no-unused-vars
    lost(event) {
      let status = this.statuses.find(item => item.sid == this.current_sid);
      status.fixed=true;
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