<template>
  <div class="status">
    <div class="top">
      <div class="labels">
        <div class="rx">RX</div>
        <div class="data">DATA</div>
      </div>
      <div class="date">{{ formattedDate }}</div>
    </div>
    <ul class="contents">
      <li v-if="visible.text">
        <div class="title">TEXT</div>
        <div class="text">
          <div class="nodata" v-if="rawdata.length==0">NO DATA</div>
          <span 
            v-for="(c,i) in fixedText" 
            v-bind:key="i"
            :class="{ 'hexascii': (typeof c)!='string' }"
          >{{((typeof c)=='string')?c:toHex(c,2)}}</span>
          <span class="unfixed" v-for="(c,i) in unfixedText" v-bind:key="i">{{toHex(c,2)}}</span>
        </div>
      </li>
      <li v-if="visible.hex">
        <div class="title">HEX({{rawdata.length }}byte)</div>
        <div class="hex">
          <div class="nodata" v-if="rawdata.length==0">NO DATA</div>
          <table v-if="rawdata.length>0">
            <tr>
              <th></th>
              <th v-for="(n,i) in 16" v-bind:key="i">{{ '+'+toHex(n-1,1) }}</th>
            </tr>
            <tr v-for="(r,i) in binViewArray" v-bind:key="i">
              <td>{{ toHex(i*16,4) }}</td>
              <td v-for="(c,j) in r" v-bind:key="j">{{toHex(c,2)}}</td>
            </tr>
          </table>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>

import {TBSKmodemJS} from "tbskmodem-js"


export default
{
  props: {
    rawdata:Array
  },
  data() {
    return {
      visible:{
        text:true,
        hex:true,
        ax25:true
      },
      date:new Date(),
      sections:{
        text:{
          contents:[], //str or number
          suffix:undefined  //intarray
        }
      },
      decoder:{
        dec:new TBSKmodemJS.utils.BrokenTextStreamDecoder(),
        pt:0
      },
      closed:false
    }
  },
  methods: {
    toHex(value,d) {
      let r=value.toString(16);
      while(r.length<d){
        r='0'+r;
      }
      return r;
    }    
  },
  computed: {
    fixedText(){
      let d=this.decoder; //デコーダー取得
      let n=this.rawdata.slice(d.pt);//未解析の配列
      let contents=this.sections.text.contents;
      for(let i of n){
        let darray=d.dec.update(i);
        if(darray==null){
          continue;
        }
        for(let j=0;j<darray.length;j++){
          if((typeof darray[j])=='string'){
            let cv=darray[j].charCodeAt();
            if(cv>=256 || (cv>=32 && cv!=127)){
              if(contents.length==0 || (typeof contents[contents.length - 1])!='string'){
                contents.push("");//新しい文字列ブロック
              }
              contents[contents.length - 1]+=darray[j];//文字列
            }else{
              contents.push(cv);//16進数
            }
          }else{
            contents.push(darray[j]);//16進数
          }
        }
      }
      d.pt+=n.length;

      return contents;
    },
    unfixedText(){
      if(this.decoder.pt<this.rawdata.length){
        this.fixedText();
      }
      // console.log("PENDING",this.decoder.dec.pending);
      return this.decoder.dec.pending;
    },
    binViewArray(){
      let r=[];
      for(let c=0;c<this.rawdata.length;){
        let w=[];
        for(let i=0;c<this.rawdata.length && i<16;c++,i++){
          w.push(this.rawdata[c]);
        }
        r.push(w);
      }
      return r;
    },
    formattedDate() {
      return this.date.toLocaleString(navigator.language, {hour12:false});
    }
  }
}
</script>

<style lang="less" scoped>
.status{
  background-color:#ffbbbb;
  padding:.1rem;
  .top{
    display: flex;
    >.labels{
      text-align: left;
      *{
        font-size:0.8rem;
        text-align: center;
        border: gray 1px solid;
        border-radius: 5%;
        // background-color: red;
        display: inline-block;
        width: 5em;
        padding:0.1rem;
        margin: 0 .2rem 0 0;
      }
    }
    >.date{
      margin-left:auto;
      margin-right:0;
      text-align: right;
      font-size: 0.6rem;
      padding:.5rem;
    }
  }
  .contents{
    list-style-type:none;
    margin:0;
    padding:0;
    .title{
      font-size: .8rem;
      font-weight:bold;
      margin-left: 0;
      margin-right: auto;
      text-align: left;
    }
    .nodata{
      padding:.2em;
      background-color: #eeeeee;
      text-align: center;
    }
    .text{
      padding:.2em;
      background-color: #eeeeee;
      text-align: left;
      word-break: break-all;
      >.hexascii{
        border: 1px gray solid;
        padding: 0 1px 0 1px;
        font-size: 0.5em;
      }
      >.unfixed{
        text-decoration:underline;
        color: red;
        padding: 0 1px 0 1px;
        font-size: 0.5em;
      }
    }        
    .hex{
      overflow-x: auto;
      background-color: #eeeeee;
      font-size:0.6em;
      table,td,tr,th{
        border-width: 0;
        border-style: none;
      }
      table {
        margin:0;
        padding:0;
        border-collapse: collapse;
        border-spacing: 0;
      }
      td,th{
        margin:0;
        padding:.1rem .2rem;
      }
      tr:nth-child(1),td:nth-child(1){
        font-weight:bold;
        background-color: #bbbbbb;
      }
      tr:nth-child(1){
        border-color:  #bbbbbb;;
      }
    } 
  }
}
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}



</style>