<template>
  <div class="dashboard">
    <div>{{ setting.frequency[1]["freq"] }} Hz - {{ticks}} Ticks</div>
    <div>
      <progress class="rms" max="1000" :value="rms"> </progress>
    </div>
    <div>{{ activity_time_text }}</div>
    <div>
    </div>
<!--    <div>RX:{{ statistics.rx }} TX:{{ statistics.tx }}</div>-->
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
      rms:0,
    }
  },
  methods: {
    setRms(v) {
      if(v===0){
        this.rms=0;
      }else{
        let db=(Math.log10(v));//16bit幅の値と仮定して計算
        const progress = (db + 2.5)/2.5; // 0～8で計算
        this.rms=(progress < 0 ? 0 : (progress>1?1:progress))*1000; // 負の場合は0にクリップ        
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
  .dashboard{
    background-color: #bbbbff;
    padding:0.25rem;
    >:nth-child(1){
      font-size: 1.3em;
//      font-weight: bold;
      margin:auto .2em;

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