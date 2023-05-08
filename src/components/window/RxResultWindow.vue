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
        <div>{{ info.line1 }}</div>
        <div>{{ status.rawdata.length }} bytes received.</div>
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
import {dbg} from '../../assets/classes';

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
        default:dbg.rxDummyData(),
      },      
//      rawdata: Array,
//      datetime:Object,
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
      formattedDate() {
        return this.status.datetime.toLocaleDateString(navigator.language);
      },
      formattedTime() {
        return this.status.datetime.toLocaleTimeString(navigator.language, { hour12: false ,hour: 'numeric', minute: '2-digit'});
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
      background-color: @RX_LABEL_BG;
      color: @RX_LABEL_TXT;
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

}
</style>