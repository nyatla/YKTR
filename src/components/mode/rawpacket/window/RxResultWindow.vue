<template>
  <div class="rxdatainfo">
    <div class="top">
      <div class="x_type">RX</div>
      <div class="d_type">DATA</div>
      <div class="datetime">
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <div class="info">
        <div>{{ line1 }}</div>
        <div>{{ bytes_text }}<span class="small"> bytes received.</span></div>
      </div>
    </div>
    <hr />
    <div class="main">
      <TileSelect :name="'tabselect'" :items="['TEXT','HEX']" :defaultSelectedIndex="0" @event-selected="changeTab"></TileSelect>
      <ul class="contents">
        <li>
          <KeepAlive>
            <TextView v-if="active_tab === 'TEXT'" ref="textview" :rawdata="status.rawdata"></TextView>
            <HexView v-else-if="active_tab === 'HEX'" ref="hexview" :rawdata="status.rawdata"></HexView>
          </KeepAlive>
        </li>
      </ul>
    </div>
    <div class="footer">
      <button @click="()=>{$emit('event-close')}">Close</button>
    </div>
  </div>
</template>

<script>
import {Functions} from '@/assets/classes';

import TextView from '@/components/view/TextView.vue';
import HexView from '@/components/view/HexView.vue';
import TileSelect from '@/components/ctrl/TileSelect.vue';




export default
  {
    components: {
      TextView,
      HexView,
      TileSelect,
    },    
    props: {
      status:{
        type:Object,
        default:undefined,
      },      
    },
    data() {
      return {
        _timer:undefined,
        bytes_text:0,
        active_tab:"TEXT",
      }
    },
    mounted(){
      const _t=this;
      function update(){
        _t.bytes_text=_t.status.rawdata.length;
        if(_t.$refs.textview){
          _t.$refs.textview.update();
        }
        if(_t.$refs.hexview){
          _t.$refs.hexview.update();
        }
      }
      this.$nextTick(()=>{
        update();
        this._timer=setInterval(()=>{
          update();
        },100);
      });
    },
    beforeUnmount() {
      clearInterval(this._timer);
    },


    methods: {
      changeTab: function(event){
        this.active_tab = event.value;
      }     
    },
    computed: {
      formattedDate() {return Functions.formattedDate(this.status.datetime)},
      formattedTime() {return Functions.formattedTime(this.status.datetime)},
      line1(){
        const setting=this.status.setting;
        return `TBSK Audio ${setting.frequency.freq}Hz ${setting.tone.ticks}Tick ${setting.baud}bps`;
      }
      }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";
@import "@/components/window/window.less";



.rxdatainfo {
  .modalwindow;
  background-color: @RX_BG;
  .top {
    display: flex;
    >.x_type {
      background-color: @RX_LABEL_BG;
      color: @RX_LABEL_TXT;
    }
  }
}
</style>