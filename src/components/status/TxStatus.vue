<template>
  <div class="rxdatainfo" @click="handleClick">
    <div class="top">
      <div class="x_type">TX</div>
      <div class="d_type">DATA</div>
      <div class="datetime">
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <div class="info">
        <div>{{ status.rawdata.length }} byte</div>
        <AdaptiveScrollDiv ref="scrolldiv">
          <template v-slot:contents>
            <div v-if="mode==0" class="statictext">{{ static_message }}</div>
          </template>          
        </AdaptiveScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>

import {dbg,Functions} from '../../assets/classes';
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
        default:dbg.txDummyData(),        
      },
    },
    data() {
      return {
        date: new Date(),
        mode:0,//表示モード
        static_message:"",
      }
    },
    mounted(){
      this.$refs.scrolldiv.setMode(11,true);
    },
    watch:{
      "status.fixed":{
        handler(new_,old_){
          if(new_===true && old_===false){
            this.$refs.scrolldiv.setMode(1);
          }
        }
      },
      "status.cache.mode":{
        handler(new_,old_){
          console.log("newmode");
          this.mode=new_;
//          this.$refs.scrolldiv.setMode(11,true);//再計算
        },
      },
      "status.cache.message":{
        handler(new_,old_){
          this.static_message=new_;
        },
      },
    },    
    methods: {
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
  background-color: @TX_BG;

  .statictext{
    display: inline-block;
    background-color: red;
//    width:10rem;
    text-align:center;
  }
  .top {
    >.x_type {
      
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }

  }
}
</style>