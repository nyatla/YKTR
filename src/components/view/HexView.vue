<template>
  <div class="hex">
    <table v-if="rawdata.length > 0">
      <tr>
        <th></th>
        <th v-for="(n, i) in 16" v-bind:key="i">{{ '+' + toHex(n - 1, 1) }}</th>
        <th></th>
      </tr>
      <tr v-for="(r, i) in display_data" v-bind:key="i">
        <td>{{ toHex(i * 16, 4) }}</td>
        <td v-for="(c, j) in r" v-bind:key="i+'-'+j">{{c}}</td>
      </tr>
    </table>
  </div>
  <div class="nodata" v-if="rawdata.length == 0">NO DATA</div>
</template>

<script>
import { Functions } from '../../assets/classes';


export default
  {
    components: {
    },    
    props: {
      rawdata: Array|Uint8Array
    },
    data() {
      return {
        display_data:[],
        parsed_len:0,
      }
    },
    methods: {
      toHex:Functions.toHex,
      update(){
        if(this.rawdata.length-this.parsed_len==0){
          return;
        }
        for(let i=this.parsed_len;i<this.rawdata.length;i++){
          if(i%16==0){
            this.display_data.push([]);            
          }
          this.display_data[this.display_data.length-1].push(this.toHex(this.rawdata[i],2));
        }
        this.parsed_len=this.rawdata.length;
      }
    },
    computed: {
      binViewArray() {
        let r = [];
        for (let c = 0; c < this.rawdata.length;) {
          let w = [];
          for (let i = 0; c < this.rawdata.length && i < 16; c++, i++) {
            w.push(this.rawdata[c]);
          }
          r.push(w);
        }
        return r;
      },
      // formattedDate() {
      //   return this.date.toLocaleString(navigator.language, { hour12: false });
      // }
    }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";

*{
  margin: 0;
  padding: 0;
}

.base {
  box-sizing: border-box;
  background-color: white;
  width:100%;
  height: 100%;
}
.nodata {
  .base;
  text-align: center;
}

.nodata {
  padding: .2em;
  background-color: white;
  text-align: center;
}

.hex {
  .base;
  overflow-x: auto;
  // font-size: 0.6em;

  table,
  td,
  tr,
  th {
    font-family:monospace;

    border-width: 0;
    border-style: none;
  }

  table {
    margin: 0;
    padding: 0;
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  th {
    margin: 0;
    padding: .1rem .2rem;
  }

  tr:nth-child(1),
  td:nth-child(1) {
    font-weight: bold;
    background-color: #bbbbbb;
  }
  th:nth-last-child(1){
    width: 100%;
  }

  tr:nth-child(1) {
    border-color: #bbbbbb;
    ;
  }
}
</style>