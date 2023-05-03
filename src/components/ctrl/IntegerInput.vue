<template>
    <input type="text" id="numeric-input" v-model="inputValue" @input="formatInput" @focusout="inputValue=inputValue.length==0?min:inputValue">
</template>
  
  <script>
  export default {
    props:{
        min:{
            type:Number,
            default:0
        },
        max:{
            type:Number,
            default:1000
        },
        initValue:{
            type:Number,
            default:0
        }
    },
    data() {
      return {
        inputValue: this.initValue
      }
    },
    methods: {
      formatInput() {
        let v= this.inputValue.replace(/[^0-9]/g, '');
        if(v.length>0){
            this.inputValue=Math.min(Math.max(Number.parseInt(v,10),this.min),this.max);
        };
      }
    }
  }
  </script>