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
        <div><span v-if="status.fixed"></span>{{ status.rawdata.length }} byte</div>        
        <AdaptiveScrollDiv ref="scrolldiv">
          <template v-slot:contents>
            <span v-for="(c, i) in fixedtext" v-bind:key="i" :class="{ 'hexascii': (typeof c) != 'string' }">{{ ((typeof c) == 'string') ? c : toHex(c, 2) }}</span>
            <span class="unfixed" v-for="(c, i) in unfixed" v-bind:key="i">{{ toHex(c, 2) }}</span>        
          </template>
        </AdaptiveScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>
import {BrokenCodeText,Functions,dbg} from '../../assets/classes';

import TextView from '../view/TextView.vue';
import HexView from '../view/HexView.vue';
import AdaptiveScrollDiv from '../ctrl/AdaptiveScrollDiv.vue';




export default
  {
    components: {
      TextView,
      HexView,
      AdaptiveScrollDiv,
    },
    props: {
      status:{
        type:Object,
        default:dbg.rxDummyData(),
      },
      info:{
        line1:String,
        line2:String,
      }
    },
    watch:{
      "status.fixed":{
        handler(new_,old_){
          if(new_===true && old_===false){
//            console.log("FIXED",this.status.cache._dec.fixed);
            this.$refs.scrolldiv.setMode(1);
          }
        },
        immediate:true,
      },
      "status.rawdata":{
        handler(new_,old_) {
          let dec=this.status.cache._dec;
          this.fixedtext=dec.fixed;
          this.unfixed=dec.unfixed;
        },
//        immediate:true,
        deep:true//暫定実装。パフォーマンスに影響があるのででっかい配列の場合は処理を切り替えて
      }
    },
    data() {
      return {
        fixedtext:[],
        unfixed:[],
      }
    },
    mounted(){
      let dec=this.status.cache._dec;
      this.fixedtext=dec.fixed;
      this.unfixed=dec.unfixed;
      if(this.status.fixed){
        this.$refs.scrolldiv.setMode(10,true);
      }
    },
    methods: {
      toHex:Functions.toHex,
      handleClick(){
        //クリックされた通知
        this.$emit("event-click",{sid:this.status.sid});
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
@import "./status.less";

.rxdatainfo {
  .statusframe;
  background-color: @RX_BG;
  .top {
    >.x_type {
      background-color: @RX_LABEL_BG;
      color: @RX_LABEL_TXT;
    }
    >.info {
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