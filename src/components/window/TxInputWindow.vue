<template>
  <div class="txinputwindow">
    <div class="top">
      <div class="x_type">TX</div>
      <div class="d_type">DATA</div>
      <div class="info">
        <div>Total <b>{{txdata.length}}</b> bytes, Estimated transmit time <b :style="{backgroundColor:estimateTime>60?'red':''}">{{estimateTime}}</b> sec.</div>
        <div>Enter your message to transmit.</div>
      </div>
    </div>
    <hr />
    <div class="main">
      <ul class="tabs">
        <li v-on:click="changeTab('text')" v-bind:class="{ 'active': active_tab === 'text' }">TEXT</li>
        <li v-on:click="changeTab('hex')" v-bind:class="{ 'active': active_tab === 'hex' }">HEX</li>
        <li v-on:click="changeTab('ax25')" v-bind:class="{ 'active': active_tab === 'ax25' }">AX25</li>
        <li v-on:click="changeTab('cq+')" v-bind:class="{ 'active': active_tab === 'cq+' }">CQ+</li>
      </ul>
      <ul class="contents">
        <li class="text" v-on:click="changeTab('text')" v-if="active_tab === 'text'">
          <textarea v-model="textdata"></textarea>
        </li>
        <li class="hex" v-on:click="changeTab('hex')" v-else-if="active_tab === 'hex'">
          <div>not implemented!</div>
        </li>
        <li class="ax25" v-on:click="changeTab('ax25')" v-else-if="active_tab === 'ax25'">
          <div>not implemented!</div>
        </li>
        <li class="cq+" v-on:click="changeTab('cq+')" v-else-if="active_tab === 'cq+'">
          <div>not implemented!</div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <button v-bind:disabled="this.txdata.length==0" @click="clickTransmit">transmit</button>
      <button @click="$emit('event-close')">close</button>
    </div>
  </div>
</template>

<script>

import TextView from '../view/TextView.vue';
import HexView from '../view/HexView.vue';
import {DEFAULT_SETTING} from '../../assets/classes';


const utf8encoder = new TextEncoder();

export default
  {
    components: {
      TextView,
      HexView,
    },    
    props: {
      setting:{
        type:Object,
        default:DEFAULT_SETTING
      },

    },
    data() {
      return {
        active_tab:"text",
        textdata: "",
        txdata:[],//送信データ
        _txdata_delay_tid:null,//送信時間推定のディレイ
      }
    },
    methods: {
      delayUpdate(){
        this.txdata=utf8encoder.encode(this.textdata);
      },
      clickTransmit(){
        if(this.txdata.length<1){
          return;
        }
        if(this._txdata_delay_tid!=null){
          clearTimeout(this._txdata_delay_tid);
        }
        this.delayUpdate();
        this.$emit("event-transmit",{data:this.txdata});
      },
      changeTab(num){
        this.active_tab = num
      }
    },
    beforeDestroy(){
      if(this._txdata_delay_tid!=null){
        clearTimeout(this._txdata_delay_tid);
        this._txdata_delay_tid=null;
      }
    },
    watch:{
      textdata: function (newValue, oldValue) {
        if(this._txdata_delay_tid!=null){
          clearTimeout(this._txdata_delay_tid);
        }
        this._txdata_delay_tid=setTimeout(()=>{
          this.delayUpdate();
        },300);
      },
    },
    computed: {
      formattedDate() {
        return this.datetime.toLocaleDateString(navigator.language);
      },
      formattedTime() {
        return this.datetime.toLocaleTimeString(navigator.language, { hour12: false ,hour: 'numeric', minute: '2-digit'});
      },
      estimateTime(){
        if(this.txdata.length==0){
          return "0";
        }
        console.log(this.setting);
        let sec=(this.txdata.length*8+this.setting.preamble.cycle*2+1)/this.setting.baud;
        if(sec<0.1){
          return "<0.1";
        }else{
          return sec.toFixed(1);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";
@import "./window.less";




.txinputwindow {
  .modalwindow;
  background-color: @TX_BG;
  .top {
    display: flex;
    >.x_type {
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }
  }  
  .base {
    box-sizing: border-box;
    background-color: white;
    width:100%;
    height: 100%;
  }
  .contents {
    list-style-type: none;
    margin: 0;
    padding: 0;
    >.text{
      .base;
      textarea{
        box-sizing: border-box;
        width:100%;
        height:100%;
        resize: none;
        padding: .25rem;
        border: none;
        border-width: 0;
        overflow-y: scroll;
        color:black;
        background-color: white;
        
      }
      textarea:focus {
        border-width: 0;
        background-color: @light-gray;
        outline: none;
        color:black;
      }      
    }    
  }  
}
</style>