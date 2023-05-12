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
            <div v-if="mode==1" class="txtext">
              <span v-for="(c, i) in static_message" v-bind:key="i" :class="{ 'hexascii': (typeof c) != 'string' }">{{ ((typeof c) == 'string') ? c : toHex(c, 2) }}</span>            
            </div>
          </template>          
        </AdaptiveScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>

import {Functions} from '../../assets/classes';
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
        default:undefined,        
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
      if(this.status.fixed){
        this.$refs.scrolldiv.setMode(0,true);
        this.static_message=this.status.cache.message;
        this.mode=1;
      }else{
        this.$refs.scrolldiv.setMode(11,true);
      }
    },
    watch:{
      // "status.fixed":{
      //   handler(new_,old_){
      //     if(new_===true && old_===false){
      //       this.$refs.scrolldiv.setMode(1);
      //     }
      //   }
      // },
      "status.cache.mode":{
        handler(new_,old_){
          // if(this.status.fixed){
          //   return;
          // }
          this.mode=new_;
          if(this.mode==1){
            console.log("mode change");
            this.$refs.scrolldiv.setMode(1,true);
          }
        },
      },
      "status.cache.message":{
        handler(new_,old_){
          this.static_message=new_;
          this.$refs.scrolldiv.update();
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

  .info{
    .statictext{
      display: inline-block;
      text-align:center;
      width:10rem;
      font-size:.9rem;
      margin:0;
      padding:0;
      border:1px solid;
      font-weight: bold;
    }
    .hexascii{
      display: inline-block;
      text-align: center;
      font-size: 0.8rem;
      margin:0 0.1rem;
      background-color: @light-gray;
      width:1.2rem;
    }

    .txtext{
      display: inline-block;
    }

  }

  .top {
    >.x_type {
      
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }

  }
}
</style>