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
        <div>{{ rawdata.length }} byte</div>
        <AdaptiveRightScrollDiv :text="rawdata"></AdaptiveRightScrollDiv>
      </div>
    </div>
    <div class="sub">
    </div>
  </div>
</template>

<script>

import TextView from './view/TextView.vue';
import HexView from './view/HexView.vue';
import AdaptiveRightScrollDiv from './ctrl/AdaptiveRightScrollDiv.vue';




export default
  {
    components: {
      TextView,
      HexView,
      AdaptiveRightScrollDiv,
    },    
    props: {
      rawdata: Array,
      datetime:Object,
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
        return this.datetime.toLocaleDateString(navigator.language);
      },
      formattedTime() {
        return this.datetime.toLocaleTimeString(navigator.language, { hour12: false ,hour: 'numeric', minute: '2-digit'});
      }
    }
  }
</script>

<style lang="less" scoped>
@import "../assets/global.less";


.rxdatainfo {
  background-color: @TX_BG;

  padding: .25rem;

  .top {
    display: flex;
    overflow: hidden;
    >.label {
      border: black 1px solid;
      height: 2rem;
      font-weight: bolder;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    >.x_type {
      .label;
      width: 2rem;
      min-width: 2rem;
      background-color: @TX_LABEL_BG;
      color: @TX_LABEL_TXT;
    }

    >.d_type {
      margin-left: 0.25rem;
      .label;
      width: 4rem;
      min-width: 4rem;
    }

    >.datetime {
      margin-left: 0.25rem;

      >* {
        width: 5rem;

      }

      >:nth-child(1) {
        font-size: 0.5rem;
      }

      >:nth-child(2) {
        font-family: sans-serif monospace;
        margin-top: 0.0rem;
        font-size: 1.3rem;
        font-weight: bold;
      }
    }

    >.info {
      width: 100%;
      margin-left: auto;
      margin-right: 0;
      text-align: right;
      // overflow: hidden;

      >:nth-child(1) {
        font-size: 0.5rem;
      }

      >:nth-child(2) {
        font-size: 1.3rem;
        width: 100%;
        margin-top: 0.0rem;
        overflow-x: hidden;

      }
    }
  }
}
</style>