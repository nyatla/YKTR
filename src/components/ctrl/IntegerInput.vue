<template>
    <input type="text" id="numeric-input" @input="handleInput" @focusout="handleFocusOut" :style="_is_valid?{}:{color:'red'}" :value="value">
</template>
  
  <script>
  export default {
    props:{
        name:{
          type:String,
          default:"IntegerInput",
        },
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
    watch: {
      value(newValue) {
        if(this._is_valid){
          this.$emit('change',{name:this.name,value:newValue});
        }
      }
    },    
    data() {
      return {
        value: this.initValue,
        _is_valid:true
      }
    },
    methods: {
      parseText(text){
        if(isNaN(text)){
          return false;
        }
        let n=Number.parseInt(text,10);
        if(n>this.max || n<this.min){
          return false;
        }
        return n;
      },
      handleFocusOut(event){
        if(!this._is_valid){
          this.value=this.initValue;
          this._is_valid=true;
        }
      },
      handleInput(event) {
        let pn=this.parseText(event.target.value);
        this._is_valid=pn!==false;
        this.value=pn!==false?pn:event.target.value;
      }
    },
    computed:{
    }
  }
  </script>