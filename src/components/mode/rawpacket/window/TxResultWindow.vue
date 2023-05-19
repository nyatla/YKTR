<template>
  <div class="rxdatainfo">
    <div class="top">
      <div class="x_type">TX</div>
      <div class="d_type">DATA</div>
      <div class="datetime">
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <div class="info">
        <div>{{ line1 }}</div>
        <div>
          <span v-if="now_transmit">Transmitting...</span>
          <span v-else>{{ status.rawdata.length }}<span class="small"> bytes transmitted.</span></span>          
        </div>
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
        <li >
        </li>
      </ul>
    </div>
    <div class="footer">
      <button :disabled="!now_transmit" @click="()=>{$emit('event-break')}">Break</button>
      <button @click="()=>{$emit('event-close')}">Close</button>
    </div>
  </div>
</template>

<script>
import {Functions} from '@/assets/classes';

import TextView from '@/components/view/TextView.vue';
import HexView from '@/components/view/HexView.vue';




export default
  {
    components: {
      TextView,
      HexView,
    },    
    props: {
      status:{
        type:Object,
        require:true
      },
    },
    data() {
      return {
        now_transmit:false,
        _timer:undefined,
        bytes_text:0,        
        active_tab:"text",
      }
    },
    mounted(){
      const _t=this;
      function update(){
        _t.now_transmit=!_t.status.fixed;
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
      if(this._timer){
        clearInterval(this._timer);
      }
    },

    methods: {
      changeTab: function(num){
        this.active_tab = num
      },
    },

    computed: {
      formattedDate() {return Functions.formattedDate(this.status.datetime)},
      formattedTime() {return Functions.formattedTime(this.status.datetime)},
      line1(){
        const setting=this.status.setting;
        return `TBSK Audio ${Functions.formatFreq(setting.frequency.freq)} ${setting.tone.ticks}Tick ${setting.baud}bps`;
      }
    }
  }
  
</script>

<style lang="less" scoped>
@import "@/assets/global.less";
@import "@/components/window/window.less";



.rxdatainfo {
  .modalwindow;
  background-color: @TX_BG;
  .top {
    display: flex;
    >.x_type {
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }
  }
}
</style>