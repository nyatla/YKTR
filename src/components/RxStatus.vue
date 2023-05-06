<template>
  <div class="rxdatainfo" @click="handleClick">
    <div class="top">
      <div class="x_type">RX</div>
      <div class="d_type">DATA</div>
      <div class="datetime">
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <div class="info">
        <div>{{ rawdata.length }} byte</div>
        <AdaptiveRightScrollDiv>
          <template v-slot:contents>
            <span v-for="(c, i) in fixed" v-bind:key="i" :class="{ 'hexascii': (typeof c) != 'string' }">{{ ((typeof c) == 'string') ? c : toHex(c, 2) }}</span>
          <span class="unfixed" v-for="(c, i) in unfixed" v-bind:key="i">{{ toHex(c, 2) }}</span>            
          </template>
        </AdaptiveRightScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>
import {BrokenCodeText,toHex} from '../assets/classes';

import TextView from './view/TextView.vue';
import HexView from './view/HexView.vue';
import AdaptiveRightScrollDiv from './ctrl/AdaptiveRightScrollDiv.vue';




export default
  {
    components: {
      TextView,
      HexView,
      AdaptiveRightScrollDiv,
    },
    props: {
      rawdata: Array,
      datetime:{
        type:Object,
        default:new Date()
      },
      info:{
        line1:String,
        line2:String,
      }
    },
    watch:{
      rawdata:{
        handler(new_,old_) {
          if(old_===undefined || new_.length<=old_.length){
            this._dec=new BrokenCodeText();
            this._dec.update(new_);
          }else{
            this._dec.update(new_.slice(old_.length));
          }
          this.fixed=this._dec.fixed;
          this.unfixed=this._dec.unfixed;
        },
        immediate:true,
        deep:true//暫定実装。パフォーマンスに影響があるのででっかい配列の場合は処理を切り替えて
      }
    },
    data() {
      return {
        _dec:undefined,
        date: new Date(),
        fixed:"",
        unfixed:[],
        closed: false
      }
    },
    methods: {
      toHex:toHex
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
@import "../assets/global.less";


.rxdatainfo {
  background-color: @RX_BG;
  cursor:pointer;

  padding: .25rem;

  .top {
    display: flex;
    overflow: hidden;
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
      width: 100%;
      margin-left: auto;
      margin-right: 0;
      text-align: right;
      // overflow: hidden;

      >:nth-child(1) {
        font-size: 0.5rem;
      }

      >:nth-child(2) {
        font-size: 1.3rem;
        width: 100%;
        margin-top: 0.0rem;
        overflow-x: hidden;

      }
      .unfixed{
        display: inline-block;
        text-align: center;
        color:red;
        border: none;
        background-color: @light-gray;
        width:1.2rem;
        margin: 0 0.1rem;
        font-size: 0.8rem;
      }
    }
  }
}
</style>