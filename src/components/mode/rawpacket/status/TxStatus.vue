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
            <div v-if="mode==0" class="statictext">{{ static_message }}</div>
            <div v-else-if="mode==1" class="txtext">
              <template v-for="(c, i) in txdata" >
                <span v-if="c[0]==0" :key="'s'+i">{{c[1]}} </span>
                <span v-else="c[0]==1" class="hexascii" :key="'h'+i">{{c[1]}}</span>
              </template>
            </div>
        </AdaptiveScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>

import {Functions} from '@/assets/classes';
import TextView from '@/components/view/TextView.vue';
import HexView from '@/components/view/HexView.vue';
import AdaptiveScrollDiv from '@/components/ctrl/AdaptiveScrollDiv.vue';

function conv2TxData(txdata)
{
  let w=[];
  for(let i of txdata){
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
    },
    data() {
      return {
        date: this.status.datetime,
        mode:0,//表示モード
        static_message:"",
        txdata:[],//[[class,string],..]
      }
    },
    mounted(){
      if(this.status.fixed){

        this.$refs.scrolldiv.setMode(10,true);
        this.initTxData();
        this.mode=1;
      }else{
      }
    },
    watch:{
    },    
    methods:
    {
      initTxData(){
        let f=conv2TxData(this.status.fixedData);
        let u=conv2TxData(this.status.unfixedData);
        this.txdata.push(...f);
        this.txdata.push(...u);
      },
      setMessage()
      {
        const tbl={new:"",modulate:"Modulating",transmit:"Transmitting",break:"Breaked",complete:"Completed"};
        this.static_message=tbl[this.status.state];
        this.mode=0;
        this.$refs.scrolldiv.setMode(11,true);
      },
      /**
       * 差分じゃなくて一括
       */
      setTxData()
      {
        this.mode=1;
        //表示データに変換
        this.initTxData();
        this.static_message="";
        this.$refs.scrolldiv.setMode(1,true);
      },
      handleClick(){
        //クリックされた通知
        this.$emit("event-click",{type:"tx",sid:this.status.sid});
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