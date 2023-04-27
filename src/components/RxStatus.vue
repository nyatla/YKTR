<template>
  <div :class="statusStyle">
    <div class="top">
      <div class="labels">
        <div :class="lavel1Style">RX</div>
        <div class="data">DATA</div>
      </div>
      <div class="date">{{ formattedDate }}</div>
    </div>
    <div class="contents">
      <div class="text" v-if="!fixed">
        <div class="data data_running">
          <span 
          v-for="(c,i) in fixedText" 
          v-bind:key="i"
          :class="{ 'hexascii': (typeof c)!='string' }"
          >{{((typeof c)=='string')?c:toHex(c,2)}}</span>
        </div>
        <div class="unfix_data">
          <span class="unfixed" v-for="(c,i) in unfixedText" v-bind:key="i">{{toHex(c,2)}}</span>
        </div>
      </div>
      <div class="text" v-if="fixed">
        <div class="data data_fixed">
          <span 
          v-for="(c,i) in allText" 
          v-bind:key="i"
          :class="{ 'hexascii': (typeof c)!='string' }"
          >{{((typeof c)=='string')?c:toHex(c,2)}}</span>
        </div>
      </div>

        <!-- 
        <div class="fixed">
          <span 
          v-for="(c,i) in fixedText" 
          v-bind:key="i"
          :class="{ 'hexascii': (typeof c)!='string' }"
          >{{((typeof c)=='string')?c:toHex(c,2)}}</span>
          <span class="unfixed" v-for="(c,i) in unfixedText" v-bind:key="i">{{toHex(c,2)}}</span>
        </div>-->
      <!-- <li v-if="visible.hex">
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
      </li> -->
    </div>
  </div>
</template>

<script>

import {TBSKmodemJS} from "tbskmodem-js"


export default
{
  props: {
    rawdata:Array,
    fixed:Boolean
  },
  data() {
    return {
      label:{
        active:false
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
    },
    updateContentsData(contents,darray){
      if(darray!=null){
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
      return contents;
    }
  },
  computed: {
    statusStyle(){
      return "status "+(this.fixed?"status_fixed":"");
    },
    lavel1Style(){
      return this.fixed?"rx-fixed":"rx-working";
    },
    dataRowStyle(){
      return "data "+(this.fixed?"data-fixed":"data-working");
    },
    allText(){
      let d=this.decoder; //デコーダー取得
      let contents=this.sections.text.contents;
      if(d.dec.pending.length>0){
        let darray=d.dec.update();
        this.updateContentsData(contents,darray);
        d.pt++;
      }
      return contents;
    },

    fixedText(){
      let d=this.decoder; //デコーダー取得
      let n=this.rawdata.slice(d.pt);//未解析の配列
      let contents=this.sections.text.contents;
      for(let i of n){
        let darray=d.dec.update(i);
        if(darray==null){
          continue;
        }
        this.updateContentsData(contents,darray);
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
  padding:.2rem;
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
      .rx-fixed{
        background-color:#ffbbbb;
        border: red 1px solid;
        color:red;
      }
      .rx-working{
        background-color:red;
        border: red 1px solid;
        color:white;
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
    margin:0;
    padding:0;
    .text{
      position:relative;
      padding:.2rem;
      text-align: left;
      overflow:hidden;
      height:1.2rem;

      .data{
        // position: absolute;
        white-space:nowrap;
        >.hexascii{
          border: 1px gray solid;
          padding: 0 1px 0 1px;
          font-size: 0.5rem;
        }
      }
      >.data_running{
        position: absolute;
        white-space:nowrap;
        right:0;
      }
      >.data_fixed{
      }

      >.unfix_data{
        position: absolute;
        white-space:nowrap;
        bottom:0;
        right:0;
        background-color: #eeeeee;
        >.hexascii{
          border: 1px gray solid;
          padding: 0 1px 0 1px;
          font-size: 0.5em;
        }
        >.unfixed{
          text-decoration:underline;
          color: red;
          padding: 0 1px 0 1px;
          font-size: 0.8em;
        }
      }

    }        /*
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
    } */
  }
}
.status_fixed{
  background-color: #eeeeee;
}
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}



</style>