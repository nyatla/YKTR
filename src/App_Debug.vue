<template>
  <div class="dashboard">
    <Transition name="fade">
      <div v-if="tttest">
        WAIT FOR SIGNAL
      </div>
    </Transition>
    <h1>WELCOME TO DEBUG LAND!</h1>
    <div v-if="tttest">TRANSITION</div>
    <hr/>
    <button @click="tttest=!tttest">Transition</button>
    <button @click="domodal()">Show Modal!</button>
  </div>
</template>

<script>
export default
{
  props: {
  },
  data() {
    return {
      tttest:false,
    }
  },
  methods: {
    
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


</style>