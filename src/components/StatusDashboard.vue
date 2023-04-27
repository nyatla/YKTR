<template>
  <div class="dashboard">
    <Transition name="fade">
      <div v-if="tttest">
        WAIT FOR SIGNAL
      </div>
    </Transition>

    <div>{{ info.frequency }} Hz - {{info.ticks}} Ticks</div>
    <div>
      <progress id="rms" max="100" value="70"> 70% </progress>
    </div>
    <div>{{ time.toLocaleString() }}</div>
    <div>
      <div>DEBUG LAND</div>
      <button @click="this.$emit('debug','detect')">detect</button>
      <button @click="this.$emit('debug','message',0)">MESSAGE</button>
      <button @click="this.$emit('debug','lost')">LOST</button>
    </div>
<!--    <div>RX:{{ statistics.rx }} TX:{{ statistics.tx }}</div>-->
  </div>
</template>

<script>
export default
{
  props: {
    info: {
      ticks:Number,
      frequency:Number
    },
  },
  data() {
    return {
      tttest:false,
      minimize:false,
      rms:0,
      time:new Date(),
      statistics:{
        rx:0,
        tx:0
      }
    }
  },
  methods: {
    // setRms(v) {

    // },
    toggle() {
      this.minimize=!this.minimize;
    }    
  },
  computed: {
  }
}
</script>

<style lang="less" scoped>
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


  .dashboard{
    background-color: #bbbbff;
    >:nth-child(1){
      font-size: 1.5em;
      font-weight: bold;
      margin:auto .2em;

    }
  }


</style>