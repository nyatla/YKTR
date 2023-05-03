<template>
  <div class="hex">
    <div class="nodata" v-if="rawdata.length == 0">NO DATA</div>
    <table v-if="rawdata.length > 0">
      <tr>
        <th></th>
        <th v-for="(n, i) in 16" v-bind:key="i">{{ '+' + toHex(n - 1, 1) }}</th>
        <th></th>
      </tr>
      <tr v-for="(r, i) in binViewArray" v-bind:key="i">
        <td>{{ toHex(i * 16, 4) }}</td>
        <td v-for="(c, j) in r" v-bind:key="j">{{ toHex(c, 2) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>

export default
  {
    components: {
    },    
    props: {
      rawdata: Array
    },
    data() {
      return {
      }
    },
    methods: {
      toHex(value, d) {
        let r = value.toString(16);
        while (r.length < d) {
          r = '0' + r;
        }
        return r;
      },
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
      formattedDate() {
        return this.date.toLocaleString(navigator.language, { hour12: false });
      }
    }
  }
</script>

<style lang="less" scoped>
@import "@/assets/global.less";

*{
  margin: 0;
  padding: 0;
}
.nodata {
  padding: .2em;
  background-color: white;
  text-align: center;
}

.hex {
  overflow-x: auto;
  background-color: white;
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