<template>
  <div class="dashboard">
    <div>
      WAIT FOR SIGNAL
    </div>
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
  .dashboard{
    background-color: #bbbbff;
    >:nth-child(1){
      font-size: 1.5em;
      font-weight: bold;
      margin:auto .2em;

    }
  }


</style>