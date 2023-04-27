<template>
  <div class="timeline" v-if="!closed">
    <h1>{{ title }}</h1>
    <hr />
    <!-- <RawDataStatus class="status" v-for="(status, index) in items"  :init_type="status.init_type" :key="index" ref="items"></RawDataStatus> -->
    <StatusDashboard :info="{ frequency: 99, ticks: 100 }" @debug="debug"></StatusDashboard>
    <ul class="status-ul">
        <li v-for="(status, index) in statuses" :key="index">
            <RxStatus v-if="status.type == 'rx'" :rawdata="status.rawdata" :fixed="status.fixed"></RxStatus>
        </li>
    </ul>
  </div>
</template>



  
<script>
import RxStatus from './RxStatus.vue';
import StatusDashboard from './StatusDashboard.vue';

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
    tbsk: Object,//TBSKmodemJSインスタンス
    params: {
      frequency: Number, //初期化パラメータ
      tone: Object
    }
  },

  data() {
    return {
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
  created() {
    let _t = this;
    console.log("NOT IMPLEMENTED! TONE!");
    console.log("Create socket with params", this.params);
    let socket = new this.tbsk.misc.TbskSocket({ carrier: this.params.frequency, encoding: "bin" });
    socket.addEventListener("open", () => {
      console.log("Socket open!\n");
    });
    socket.addEventListener("detected", (event) => { _t.detected(event); });
    socket.addEventListener("message", (event) => { _t.message(event); });
    socket.addEventListener("lost", (event) => { _t.lost(event); });
    // socket.addEventListener("sendstart",(event)=>{console.log("TX:("+event.id+")");});
    // socket.addEventListener("sendcompleted",(event)=>{console.log("done\n");});
    //socket.addEventListener("close",(event)=>{console.log("closed!\n");});
    this._socket = socket;
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

h1 {
  margin: auto 0;
  padding: auto 0;
}

.status-ul {
  list-style: none;
  margin: 0;
  padding: .25rem 0 0 0;
  >li {
    padding-bottom:.25rem;
  }
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>