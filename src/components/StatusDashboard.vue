<template>
  <div class="container">
    <div class="dashboard">
      <div class="title">TBSK Packet Capter</div>
      <hr/>
      <div class="panel">
        <div class="uptime">
          <div>UPTIME</div>
          <div>{{activity_time_text}}</div>
        </div>
        <div class="info">
          <div class="line1">CARRIER {{ setting.frequency[1]["freq"] }} Hz - {{ticks}} Ticks TBSK Modulation</div>
          <div class="volume">
            <div :style="metor"><!--metor --></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {DEFAULT_SETTING} from "../assets/classes"




export default
{
  props: {
    setting:{
      type:Object,
      default:DEFAULT_SETTING
    },
    activity_time_text:{
      type:String,
      default:"",
    },
  },
  data() {
    return {
      metor:{},
    }
  },
  methods: {
    setRms(v) {
      if(v===0){
        this.rms=0;
      }else{
        let db=(Math.log10(v));//16bit幅の値と仮定して計算
        const progress = (db + 2.5)/2.5; // 0～8で計算
        const rms=(progress < 0 ? 0 : (progress>1?1:progress))*100; // 負の場合は0にクリップ 
        this.metor={width:(rms)+"%"};
      }
    },
    toggle() {
      this.minimize=!this.minimize;
    }
  },
  computed: {
    ticks(){
      let p=this.setting.tone[1];
      return p["points"]*p["cycle"];
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/global.less";
  .container{
//    background-color: antiquewhite;
    width: 100%;
    height:6rem;
  }
  .dashboard{
//    background-color: red;

    .title{
      font-size:1.2rem;
      font-weight:  bold;
    }
    height:5rem;
    padding:0.25rem;
    >hr {
      height: 1px;
      background-color: black;
      border: none;
    }
    .panel{
      display: flex;
      .uptime{
        width:15rem;
        :nth-child(1){
          height:.8rem;
          font-size: .8rem;
          text-align: left;
          font-weight: bold;

        }
        :nth-child(2){
          height:1.6rem;
          font-size: 1.6rem;
          text-align: left;
          font-weight: bold;
          .hm{
            
          }
          .s{            
          }
        }        
      }
      .info{
        overflow: hidden;
        width: 100%;
        :nth-child(1){
          white-space:nowrap;
          height:.8rem;
          font-size: .8rem;
          text-align: left;
          font-weight: bold;
        }
        // :nth-child(2){
        //   height:1.4rem;
        //   width: 100%;
        //   background-color: @light-gray;
        // }
        .volume{
          width:100%;
          background-color: @light-gray;
          margin: .3rem 0 0 0;
          // height:100%;
          >:nth-child(1){
            height:1rem;
            background-color: @cyan;
          }
        }


      }
    }
  }

  .rms{
      width:80%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter-from,
  .fade-leave-to{
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from{
    opacity: 1;
  }




</style>