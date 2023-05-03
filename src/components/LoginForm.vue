<template>
  <div class="main" v-bind:class="{ 'fade-out': fadeout }" v-if="!fadeout">
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
                <TileSelect :items="freqs" :defaultSelectedIndex="freqs_select"></TileSelect>
              </div>
              <label>Tone</label>
              <div>
                <div class="subselect">
                  <TileSelect :items="tones" :defaultSelectedIndex="tones_select" @selected-event="OnToneSelect">
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
                        <IntegerInput :max="1000" :min="10" :initValue="tones[0][1]['points']"></IntegerInput>
                      </td>
                      <td>x</td>
                      <td>
                        <IntegerInput :max="100" :min="1" :initValue="tones[0][1]['cycle']"></IntegerInput>
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
                        <IntegerInput :max="1000" :min="10" :initValue="tones[1][1]['points']"></IntegerInput>
                      </td>
                      <td>x</td>
                      <td>
                        <IntegerInput :max="100" :min="1" :initValue="tones[1][1]['cycle']"></IntegerInput>
                      </td>
                      <td>
                        <IntegerInput :max="32" :min="1" :initValue="tones[1][1]['div']"></IntegerInput>
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

    <button class="go" @click="this.$emit('onStartApplication', selectedFreq)">Go!</button>
  </div>
</template>
  
<script>
import TileSelect from './ctrl/TileSelect.vue';
import IntegerInput from './ctrl/IntegerInput.vue';

export default {
  components: {
    TileSelect,
    IntegerInput
  },
  props: {
    default_freqs: {
      type: Object,
      default: [
        ['8kHz', { freq: 8000 }],
        ['16kHz', { freq: 16000 }],
        ['24kHz', { freq: 24000 }],
        ['48kHz', { freq: 48000 }]
      ]
    },
    default_tone: {
      type: Object,
      default: [
        ['SIN', { points: 100, cycle: 1 }],
        ['XPSK', { points: 100, cycle: 1, div: 8 }],
      ]
    }
  },
  data() {
    return {
      show_mod_setting: true,
      freqs: this.default_freqs,
      freqs_select: 0,
      tones: this.default_tone,
      tones_select: 0,
      fadeout: false,
    }
  },
  methods: {

    freqSelected() {
      return this.freqs[this.freqs_select];
    },
    // toneSelected() {
    //   return this.tone[this.tones_select];
    // },
    OnToneSelect(m) {
      this.tones_select = m.index;
    },

    login() {
    }
  },
  computed:{
    summary(){
      console.log("SUMMARY");
      let freq= this.freqs[this.freqs_select];
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

      ul {
        //    margin: auto;
      }
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