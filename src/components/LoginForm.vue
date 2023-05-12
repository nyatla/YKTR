<template>
  <div class="screen">
    <img class="logo" :src="application.res.imgs.logo"/>
    <div class="title">TBSK Transceiver</div>
    <div class="subtitle">Light weight general purpose audio transceiver</div>
    <hr/>
    <div class="footer">{{application.version.toString()}} - Copyright © 2023 <a href="https://nyatla.jp/">nyatla.jp</a></div>
    <div class="main">
      <div class="title">Set Application Type</div>
      <hr />
      <ul class="settings">
        <li>
          <label>Application Mode</label>
          <button style="border: none;" class="setting_btn">Raw packet capture</button>
        </li>
        <li>
          <label>Modulation Setting</label>
          <button class="setting_btn" @click="show_mod_setting = !show_mod_setting">{{ summary }}</button>
          <div style="" v-if="show_mod_setting">
            <div>
              <div class="sub">
                <label>Frquency</label>
                <div class="subselect">
                  <TileSelect :name="'freqs_select'" :items="freqTabs" :defaultSelectedIndex="freqs_select" @event-selected="OnChangeModulationParam"></TileSelect>
                </div>
                <label>Tone</label>
                <div>
                  <div class="subselect">
                    <TileSelect :name="'tones_select'" :items="toneTabs" :defaultSelectedIndex="tones_select" @event-selected="OnChangeModulationParam">
                    </TileSelect>
                  </div>
                  <div class="tone_params">
                    <table v-if="tones_select == 0">
                      <tr>
                        <td>points</td>
                        <td></td>
                        <td>cycle</td>
                      </tr>
                      <tr>
                        <td>
                          <IntegerInput :name="'tone_params_sin_points'" :max="1000" :min="10" :initValue="tones[0].points" @event-change="OnChangeModulationParam"></IntegerInput>
                        </td>
                        <td>x</td>
                        <td>
                          <IntegerInput :name="'tone_params_sin_cycle'" :max="100" :min="1" :initValue="tones[0].cycle" @event-change="OnChangeModulationParam"></IntegerInput>
                        </td>
                      </tr>
                    </table>
                    <table v-if="tones_select == 1">
                      <tr>
                        <td>points</td>
                        <td></td>
                        <td>cycle</td>
                        <td>div</td>
                      </tr>
                      <tr>
                        <td>
                          <IntegerInput :name="'tone_params_xpsk_points'" :max="1000" :min="10" :initValue="tones[1].points" @event-change="OnChangeModulationParam"></IntegerInput>
                        </td>
                        <td>x</td>
                        <td>
                          <IntegerInput :name="'tone_params_xpsk_cycle'" :max="100" :min="1" :initValue="tones[1].cycle" @event-change="OnChangeModulationParam"></IntegerInput>
                        </td>
                        <td>
                          <IntegerInput :name="'tone_params_xpsk_div'" :max="32" :min="1" :initValue="tones[1].div" @event-change="OnChangeModulationParam"></IntegerInput>
                        </td>
                      </tr>
                    </table>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <button class="go" @click="go">Go!</button>
    </div>
  </div>

</template>
  
<script>
import {FrequencySpec,SinToneSpec,XpskSinToneSpec,ModulationSpec} from '../assets/classes';
import TileSelect from './ctrl/TileSelect.vue';
import IntegerInput from './ctrl/IntegerInput.vue';

//永続データ
const FREQUENCY_LIST=
[
  new FrequencySpec(8000),
  new FrequencySpec(16000),
  new FrequencySpec(24000),
  new FrequencySpec(32000),
  new FrequencySpec(48000),
];





export default {
  components: {
    TileSelect,
    IntegerInput
  },
  props: {
    application:{
      type:Object,
      required:true,
    },
  },
  data() {
    return {
      show_mod_setting: false,
      freqs:FREQUENCY_LIST,
      freqs_select:1,
      tones:undefined,
      tones_select:1,
    }
  },
  beforeMount(){

    const current_setting=this.application.current_setting;
    //freq_select
    const fl=FREQUENCY_LIST;
    for(let i=0;i<fl.length;i++){
      if(fl[i].name==current_setting.frequency.name){
        this.freqs_select=i;
        break;
      }
    }
    //tone list
    this.tones=[
        new SinToneSpec(10,10),
        new XpskSinToneSpec(10,10),
    ];    
    let current_tone=current_setting.tone;
    switch(current_tone.name){
    case "SIN":
      this.tones[0].copyFrom(current_tone);
      break;
    case "XPSK":
      this.tones[1].copyFrom(current_tone);
      break;
    default:
      throw new Error();
    }
    const tl=this.tones;
    for(let i=0;i<tl.length;i++){
      if(tl[i].name==current_setting.tone.name){
        this.tones_select=i;
        break;
      }
    }
    console.log("init",this.tones);
  },
  methods: {
    freqSelected() {
      return this.freqs[this.freqs_select];
    },
    OnChangeModulationParam(event){
      console.log("OnEvent",event);
      switch(event.name){
      case "freqs_select":
        this.freqs_select=event.index;
        break;
      case "tones_select":
        this.tones_select=event.index;
        break;
      case "tone_params_sin_points":
        this.tones[0].points=event.value;
        break;
      case "tone_params_sin_cycle":
        this.tones[0].cycle=event.value;
        break;
      case "tone_params_xpsk_points":
        this.tones[1].points=event.value;
        break;
      case "tone_params_xpsk_cycle":
        this.tones[1].cycle=event.value;
        break;
      case "tone_params_xpsk_div":
        this.tones[1].div=event.value;
        break;        
      }
    },
    go() {
      this.$emit('event-go',{
        name:"",
        setting:new ModulationSpec(
          4,
          this.freqs[this.freqs_select],
          this.tones[this.tones_select]
        )
      });
    }
  },
  computed:{
    toneTabs(){
      let r=[];
      for(let i of this.tones){
        r.push(i.name);
      }
      return r;
    },
    freqTabs(){
      let r=[];
      for(let i of this.freqs){
        r.push(i.name);
      }
      return r;
    },
    summary(){
      let freq= this.freqs[this.freqs_select];
      let tone= this.tones[this.tones_select];
      let ticks=tone.points*tone.cycle;
      return `TBSK ${freq.freq}Hz ${ticks}Ticks ${tone.name} Tone - ${(freq.freq/ticks).toFixed(1)} bps`;
    },
  }
}
</script>
  
<style lang="less" scoped>
@import "../assets/global.less";

.logo{
  margin:1rem;
  width:5rem;
}
.title{
  font-size:1.6rem;
}
.subtitle{
  font-size:0.8rem;
}
.screen{
}
.footer{
  .inherit_app_setting;
  position: fixed;
  height:2rem;
  bottom: 0;
}
.main {
  .inherit_app_setting;
  background-color: @LOGIN_BG;
  padding: .25rem;
//  position: absolute;
//  top:30vh;
  min-height:16.5rem;
  >hr {
    height: 1px;
    background-color: black;
    border: none;
  }
  >.title {
    font-weight: bolder;
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
  }


  

  .settings {
    margin: 0;
    padding: 0;

    li {
      margin: .5rem 0;
      list-style: none;

    }

    .setting_btn {
      cursor: pointer;
      border: solid 1px @gray;
      padding: .25rem 0;
      background-color: @LOGIN_SUB_BG;
      width: 100%;
    }

    .sub {
      overflow: hidden;
      margin: 0;
      text-align: left;
      background-color: @LOGIN_SUB_BG;
      padding: 1rem;
    }

    .subselect {
      padding: .3rem;
      border: solid @gray;
      border-width: 1px 0 0 0;

      li {
        text-align: center;
      }
    }

    .tone_params {
      table {
        tr {
          text-align: center;
        }

        tr:nth-child(1) {
          font-size: .8rem;
        }
      }

      input {
        width: 5em;
        text-align: right;
      }
    }

  }

  .go {
    font-size: 2rem;
    width: 100%;
    margin: .5rem 0;
  }
}

</style>