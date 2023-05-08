<!-- 
    https://cr-vue.mio3io.com/examples/modal.html#%E3%82%BD%E3%83%BC%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%89
-->
<template>
  <div class="overlay" @click.self="$emit('close')">
    <slot></slot>
  </div>
</template>
  
<style lang="less" scoped>


.overlay {
  display: flex;
//  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  // .window {
  //   background: #fff;
  //   border-radius: 4px;
  //   overflow: hidden;

  

  //   .footer {
  //     background: #ccc;
  //     padding: 10px;
  //     text-align: right;
  //   }
  // }  
}


</style>