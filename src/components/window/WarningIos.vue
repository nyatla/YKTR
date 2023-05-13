<template>
  <div class="window">
    <div class="top">
      For Safari browser on iPad and iPhone
    </div>
    <hr />
    <div class="main">
      On iPad and iPhone, there is a need to manually reset the audio system.
      <ol>
        <li>
          Allow microphone access in the pop-up window.
          <div>
            <img class="warn_img" :src="res[0]"/>
          </div>
        </li>
        <li>
          Tap the red microphone icon in the address bar to stop using the microphone.
          <div>
            <img class="warn_img" :src="res[1]"/>
          </div>
        </li>
        <li>
          Tap again the microphone icon to restart using the microphone.
          <div>
            <img class="warn_img" :src="res[2]"/>
          </div>
        </li>
      </ol>
      By following the above steps, the issue will be resolved.
    </div>
    <div class="footer">
      <div>
        <input type="checkbox" v-model="isChecked">
        <label>Do not show again</label>
      </div>
      <button @click="()=>{$emit('event-close',{dont_show_again:isChecked})}">OK</button>
    </div>
  </div>
</template>

<script>

import warn_ios_1 from '@/assets/warn_ios_1.jpg'
import warn_ios_2 from '@/assets/warn_ios_2.jpg'
import warn_ios_3 from '@/assets/warn_ios_3.jpg'


export default
  {
    components: {
    },    
    props: {
      application:{
        type:Object,
        default:undefined
      },
    },
    data() {
      return {
        res:[
          warn_ios_1,
          warn_ios_2,
          warn_ios_3,
        ],
        isChecked:this.application.env.dont_show_again_ios_warn===undefined?true:this.application.env.dont_show_again_ios_warn
      }
    },
    methods: {
      clickTransmit(){
        if(this.txdata.length<1){
          return;
        }
        if(this._txdata_delay_tid!=null){
          clearTimeout(this._txdata_delay_tid);
        }
        this.delayUpdate();
        this.$emit("event-transmit",{data:this.txdata});
      },
    },
    watch:{
    },
    computed: {
    }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";
@import "./window.less";




.window {
  .modalwindow;
  top:5vh;
  height:fit-content;
//  bottom:0;
  background-color: white;
//  height:auto;
  // >*{
  //   margin: 0;
  // }
  .top {
    justify-content: center;
    width: 100%;
    font-size:1.2rem;
  }  
  .main {
    // text-align: left;
    box-sizing: border-box;
    background-color: white;
    width:100%;
    height: 100%;
    >ol{
      padding: 1rem 1rem;
      // text-align:left;
      list-style-type: decimal;
      >li{
        text-align: left;
        margin: .5rem .25rem;
        >div{
          text-align: center;
          >.warn_img{
          width:30vw;
          max-width:240px;
        }
        }
      }
    }
  }
  .footer{
    margin-top:.5rem;
    position: static;
    >button{
      margin:.5rem 0;
    }
  }
}
</style>