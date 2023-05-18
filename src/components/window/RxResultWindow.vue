<template>
  <div class="rxdatainfo">
    <div class="top">
      <div class="x_type">RX</div>
      <div class="d_type">DATA</div>
      <div class="datetime">
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <div class="info">
        <div>{{ line1 }}</div>
        <div>{{ bytes_text }}<span class="small"> bytes received.</span></div>
      </div>
    </div>
    <hr />
    <div class="main">
      <ul class="tabs">
        <li v-on:click="changeTab('text')" v-bind:class="{ 'active': active_tab === 'text' }">TEXT</li>
        <li v-on:click="changeTab('hex')" v-bind:class="{ 'active': active_tab === 'hex' }">HEX</li>
      </ul>
      <ul class="contents">
        <li>
          <KeepAlive>
            <TextView v-if="active_tab === 'text'" ref="textview" :rawdata="status.rawdata"></TextView>
            <HexView v-else-if="active_tab === 'hex'" ref="hexview" :rawdata="status.rawdata"></HexView>
          </KeepAlive>
        </li>
      </ul>
    </div>
    <div class="footer">
      <button @click="()=>{$emit('event-close')}">Close</button>
    </div>
  </div>
</template>

<script>
import {Functions} from '../../assets/classes';

import TextView from '../view/TextView.vue';
import HexView from '../view/HexView.vue';




export default
  {
    components: {
      TextView,
      HexView,
    },    
    props: {
      status:{
        type:Object,
        default:undefined,
      },      
    },
    data() {
      return {
        _timer:undefined,
        bytes_text:0,
        active_tab:"text",
      }
    },
    mounted(){
      const _t=this;
      function update(){
        _t.bytes_text=_t.status.rawdata.length;
        if(_t.$refs.textview){
          _t.$refs.textview.update();
        }
        if(_t.$refs.hexview){
          _t.$refs.hexview.update();
        }
      }
      this.$nextTick(()=>{
        update();
        this._timer=setInterval(()=>{
          update();
        },100);
      });
    },
    beforeUnmount() {
      clearInterval(this._timer);
    },


    methods: {
      changeTab: function(num){
        this.active_tab = num
      }     
    },
    computed: {
      formattedDate() {return Functions.formattedDate(this.status.datetime)},
      formattedTime() {return Functions.formattedTime(this.status.datetime)},
      line1(){
        const setting=this.status.setting;
        return `TBSK Audio ${setting.frequency.freq}Hz ${setting.tone.ticks}Tick ${setting.baud}bps`;
      }
      }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";
@import "./window.less";



.rxdatainfo {
  .modalwindow;
  background-color: @RX_BG;
  .top {
    display: flex;
    >.x_type {
      background-color: @RX_LABEL_BG;
      color: @RX_LABEL_TXT;
    }
  }
}
</style>