<template>
  <div class="main">
    <div class="title">TBSK Transceiver</div>
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
                <TileSelect :name="'freqs_select'" :items="default_setting.frequency.freqs" :defaultSelectedIndex="freqs_select" @event-selected="OnChangeModulationParam"></TileSelect>
              </div>
              <label>Tone</label>
              <div>
                <div class="subselect">
                  <TileSelect :name="'tones_select'" :items="tones" :defaultSelectedIndex="tones_select" @event-selected="OnChangeModulationParam">
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
                        <IntegerInput :name="'tone_params_sin_points'" :max="1000" :min="10" :initValue="tones[0][1]['points']" @event-change="OnChangeModulationParam"></IntegerInput>
                      </td>
                      <td>x</td>
                      <td>
                        <IntegerInput :name="'tone_params_sin_cycle'" :max="100" :min="1" :initValue="tones[0][1]['cycle']" @event-change="OnChangeModulationParam"></IntegerInput>
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
                        <IntegerInput :name="'tone_params_xpsk_points'" :max="1000" :min="10" :initValue="tones[1][1]['points']" @event-change="OnChangeModulationParam"></IntegerInput>
                      </td>
                      <td>x</td>
                      <td>
                        <IntegerInput :name="'tone_params_xpsk_cycle'" :max="100" :min="1" :initValue="tones[1][1]['cycle']" @event-change="OnChangeModulationParam"></IntegerInput>
                      </td>
                      <td>
                        <IntegerInput :name="'tone_params_xpsk_div'" :max="32" :min="1" :initValue="tones[1][1]['div']" @event-change="OnChangeModulationParam"></IntegerInput>
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
</template>
  
<script>
import {clone} from '../assets/classes';
import TileSelect from './ctrl/TileSelect.vue';
import IntegerInput from './ctrl/IntegerInput.vue';

const FREQUENCY_LIST=
[
  ['8kHz', { freq: 8000 }],
  ['16kHz', { freq: 16000 }],
  ['24kHz', { freq: 24000 }],
  ['32kHz', { freq: 32000 }],
  ['48kHz', { freq: 48000 }]
];
const TONE_LIST=
[
  ['SIN', { points: 10, cycle: 10 }],
  ['XPSK', { points: 10, cycle: 10, div: 8 }],
];




export default {
  components: {
    TileSelect,
    IntegerInput
  },
  props: {
    default_setting: {
      type: Object,
      default: {
        frequency:{
          freqs:FREQUENCY_LIST,
          selected:0
        },
        tone:{
          tones:TONE_LIST,
          selected:0
        }
      }
    },
  },
  data() {
    return {
      show_mod_setting: false,
      freqs_select: this.default_setting.frequency.selected,
      tones: clone(this.default_setting.tone.tones),
      tones_select: this.default_setting.tone.selected,
    }
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
        console.log("NEEW");
        this.tones[0][1]['points']=event.value;
        break;
      case "tone_params_sin_cycle":
        this.tones[0][1]['cycle']=event.value;
        break;
      case "tone_params_xpsk_points":
        this.tones[1][1]['points']=event.value;
        break;
      case "tone_params_xpsk_cycle":
        this.tones[1][1]['cycle']=event.value;
        break;
      case "tone_params_xpsk_div":
        this.tones[1][1]['div']=event.value;
        break;        
      }
    },
    go() {
      this.$emit('event-go',{
        name:"",
        setting:{
          preamble:{
            cycle:4
          },
          frequency:this.default_setting.frequency.freqs[this.freqs_select],
          tone:this.tones[this.tones_select],
        }
      });
    }
  },
  computed:{
    summary(){
      let freq= this.default_setting.frequency.freqs[this.freqs_select];
      let tone= this.tones[this.tones_select];
      let ticks=tone[1].points*tone[1].cycle;
      return `TBSK ${freq[1].freq}Hz ${ticks}Ticks ${tone[0]} Tone`;
    },
  }
}
</script>
  
<style lang="less" scoped>
@import "../assets/global.less";

.main {
  background-color: @LOGIN_BG;
  padding: .25rem;
  position: relative;
  top:25vh;
    height:16.5rem;
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