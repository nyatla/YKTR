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
      info:{
        type:Object,
        default:{
          preamble_cycle:4,
          baud:100
        }
      }
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
      clickTransmit(){
        if(this.txdata.length<1){
          return;
        }
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
          this.txdata=utf8encoder.encode(this.textdata);
        },300);
      },
    },
    computed: {
      // txdata()
      // {
      //   switch(this.active_tab){
      //     case 0:
      //       return this.txdata;
      //     default:
      //       throw new Error();
      //   }
      // },
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
        let sec=(this.txdata.length*8+this.info.preamble_cycle*2+1)/this.info.baud;
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
    >.label {
      border: black 1px solid;
      height: 2rem;
      font-weight: bolder;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    >.x_type {
      .label;
      width: 2rem;
      min-width: 2rem;      
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }
    >.d_type {
      margin-left: 0.25rem;
      .label;
      width: 4rem;
      min-width: 4rem;      
    }
    >.datetime {
      margin-left: 0.25rem;

      >* {
        width: 5rem;
      }

      >:nth-child(1) {
        font-size: 0.5rem;
      }

      >:nth-child(2) {
        font-family: sans-serif monospace;
        margin-top: 0.0rem;
        font-size: 1.3rem;
        font-weight: bold;
      }
    }

    >.info {
      margin-left: auto;
      margin-right: 0;
      text-align: right;

      >:nth-child(1) {
        font-size: 0.5rem;
      }

      >:nth-child(2) {
        margin-top: 0.0rem;
        font-size: 1.3rem;
      }
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