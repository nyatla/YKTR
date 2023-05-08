<template>
  <div class="rxdatainfo">
    <div class="top">
      <div class="x_type">TX</div>
      <div class="d_type">DATA</div>
      <div class="datetime">
        <div>{{ formattedDate }}</div>
        <div>{{ formattedTime }}</div>
      </div>
      <div class="info">
        <div>{{ status.rawdata.length }} byte</div>
        <AdaptiveScrollDiv :text="status.rawdata"></AdaptiveScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>

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
      info:{
        line1:String,
        line2:String,
      }
    },
    data() {
      return {
        active_tab:"text",
        date: new Date(),
        closed: false
      }
    },
    methods: {
    },
    computed: {
      formattedDate() {
        return this.status.datetime.toLocaleDateString(navigator.language);
      },
      formattedTime() {
        return this.status.datetime.toLocaleTimeString(navigator.language, { hour12: false ,hour: 'numeric', minute: '2-digit'});
      }
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