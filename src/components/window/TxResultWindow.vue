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
        <div>{{ info.line1 }}</div>
        <div>{{ status.rawdata.length }} bytes transmitted.</div>
      </div>
    </div>
    <hr />
    <div class="main">
      <ul class="tabs">
        <li v-on:click="changeTab('text')" v-bind:class="{ 'active': active_tab === 'text' }">TEXT</li>
        <li v-on:click="changeTab('hex')" v-bind:class="{ 'active': active_tab === 'hex' }">HEX</li>
      </ul>
      <ul class="contents">
        <li v-if="active_tab === 'text'">
          <TextView :rawdata="status.rawdata"></TextView>
        </li>
        <li v-else-if="active_tab === 'hex'">
          <HexView :rawdata="status.rawdata"></HexView>
        </li>
      </ul>
    </div>
    <div class="footer">
      <button @click="()=>{$emit('event-close')}">close</button>
    </div>
  </div>
</template>

<script>
import {dbg,Functions} from '../../assets/classes';

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
        default:dbg.txDummyData(),
      },      
      info:{
        type:Object,
        default:{
          line1:'LINE1',
          line2:'LINE2'
        },
      }
    },
    data() {
      return {
        active_tab:"text",
        date: new Date(),
        closed: false
      }
    },
    methods: {
      changeTab: function(num){
        this.active_tab = num
      }     
    },
    computed: {
      formattedDate() {return Functions.formattedDate(this.status.datetime)},
      formattedTime() {return Functions.formattedTime(this.status.datetime)},
    }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";
@import "./window.less";



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