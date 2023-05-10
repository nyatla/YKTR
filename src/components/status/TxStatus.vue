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
          <div class="static_center">{{ infotext }}</div>
          <!-- <template v-slot:contents>
            <span>{{infotext}}</span>
          </template> -->
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
        default:undefined        
      },
      //暫定コンテンツ
      info:undefined,
    },
    data() {
      return {
        active_tab:"text",
        date: new Date(),
        infotext:"",
      }
    },
    watch:{
      "status.fixed":{
        handler(new_,old_){
          if(new_===true && old_===false){
            this.$refs.scrolldiv.setMode(1);
          }
        }
      },
      "info":{
        handler(new_,old_){
          this.infotext=new_.message;
          console.log(this.infotext);
        },
        deep:true

      }
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

  .top {
    >.x_type {
      
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }

  }
}
</style>