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
          <template v-for="(c, i) in fixedtext" >
            <span v-if="c[0]==0" :key="'s'+i">{{c[1]}} </span>
            <span v-else="c[0]==1" :key="'h'+i" class="hexascii">{{c[1]}}</span>
          </template>
          <template v-for="(c, i) in fixedtext2" >
            <span v-if="c[0]==0">{{c[1]}} </span>
            <span v-else="c[0]==1" class="hexascii">{{c[1]}}</span>
          </template>
          <template v-for="(c, i) in unfixed">
            <span class="hexascii">{{c[1]}}</span>
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

/**
 * 
 * @param {*} rxdata [string|number]
 * @retrun [[number,string]]
 */
function conv2RxData(rxdata)
{
  let w=[];
  for(let i of rxdata){
    if((typeof i)=="string"){
      w.push([0,i]);
    }else{
      w.push([1,Functions.toHex(i,2)]);
    }
  }
  return w;
}


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
      info:{
        line1:String,
        line2:String,
      }
    },
    watch:{
    },
    data() {
      return {
        last_fixed_pos:0,
        fixedtext:[], //確定値
        fixedtext2:[],//未確定文字列を含む確定値
        unfixed:[],//未確定値
      }
    },
    mounted(){
      if(this.status.fixed){
        this.fixedtext.push(...conv2RxData(this.status.fixedData));
        this.unfixed=conv2RxData(this.status.unfixedData);
        this.$refs.scrolldiv.setMode(10,true);
      }
    },
    methods: {
      update()
      {
        const fd=this.status.fixedData;
        //タイミングの問題で反映されんこともある。
        if(fd.length<1){
          return;
        }
        let fixed_pos=this.status.fixedData.length;
        if(fixed_pos-1>this.last_fixed_pos){
          //末端-1までを確定キューに淹れる。
          this.fixedtext.push(...conv2RxData(fd.slice(this.last_fixed_pos,fixed_pos-1)));
          this.last_fixed_pos=fixed_pos-1;
        }

        //末端を確定キュー2に設定
        this.fixedtext2=conv2RxData([fd[fd.length-1]]);
        //未確定を設定
        this.unfixed=conv2RxData(this.status.unfixedData);
        if(this.status.fixed){
          this.$refs.scrolldiv.setMode(1);
        }else{
          this.$refs.scrolldiv.update();
        }
      },
      handleClick(){
        //クリックされた通知
        this.$emit("event-click",{type:"rx",sid:this.status.sid});
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
      .hexascii{
        display: inline-block;
        text-align: center;
        font-size: 0.8rem;
        margin:0 0.1rem;
        background-color: @light-gray;
        width:1.2rem;
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