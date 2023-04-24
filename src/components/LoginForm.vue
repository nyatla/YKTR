<template>
    <div class="login" v-bind:class="{ 'fade-out': fadeout }" v-if="!fadeout">
      <h1>{{ title }}</h1>
      <hr/>
      <select v-model="selectedFreq">
        <option v-for="(option, index) in frequencies" :key="index" :value="option.freq">{{ option.name }}</option>
      </select>
      <input v-model="name" type="text" placeholder="Enter your call sign" maxlength="6" pattern="[a-zA-Z0-9]+">
      <button @click="this.$emit('onStartApplication',selectedFreq)">Start</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        frequencies: [
          {name:'8kHz(80bps)',freq:8000},
          {name:'16kHz(160bps)',freq:16000},
          {name:'32kHz(320bps)',freq:32000},
          {name:'48kHz(480bps)',freq:48000},
        ],
        selectedFreq: 16000,
        name: '',
        fadeout: false
      }
    },
    methods: {
      login() {
        // ログイン処理
        console.log(`選択されたオプション: ${this.selectedOption}`)
        console.log(`入力された名前?: ${this.name}`)
      
      }
    }
  }
  </script>
  
  <style scoped>
  .login {
    display: flex;
    flex-direction: column;
    align-items: center;
  }


  
  </style>