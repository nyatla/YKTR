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
        <div>{{ rawdata.length }} bytes received.</div>
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
          <TextView :rawdata="rawdata"></TextView>
        </li>
        <li v-else-if="active_tab === 'hex'">
          <HexView :rawdata="rawdata"></HexView>
        </li>
      </ul>
    </div>
    <div>
      <button>close</button>
    </div>
  </div>
</template>

<script>

import TextView from '../view/TextView.vue';
import HexView from '../view/HexView.vue';




export default
  {
    components: {
      TextView,
      HexView,
    },    
    props: {
      rawdata: Array,
      datetime:Object,
      info:{
        line1:String,
        line2:String,
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
        return this.datetime.toLocaleDateString(navigator.language);
      },
      formattedTime() {
        return this.datetime.toLocaleTimeString(navigator.language, { hour12: false ,hour: 'numeric', minute: '2-digit'});
      }

    }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";


.rxdatainfo {
  background-color: @RX_BG;

  padding: .25rem;

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

  >hr {
    height: 1px;
    background-color: black;
    border: none;
  }
  .main{
    ul{
      margin: 0;
      padding: 0;
    }
    li{
      list-style: none;
    }
    .tabs {
      overflow: hidden;
    }
    .tabs li,.tabs label {
      display: flex;
      align-items: center;
      justify-content: center;      
      float: left;
      width: 4rem;
      height: 1rem;
      padding: .1rem;
      cursor: pointer;
      transition: .2s;
      font-size:0.5rem;
    }
    .tabs li:not(:first-child),.tabs label:not(:first-of-type) {
      border-left: none;
    }
    .tabs li.active,.tabs :checked + label {
      font-size:0.8rem;
      font-weight: bold;
      cursor: auto;
      background-color:@yellow;
    }
    .contents{
      overflow: hidden;
      margin:0.25em 0;
    }

  }

  .contents {
    list-style-type: none;
    margin: 0;
    padding: 0;    

    
  }
}
</style>