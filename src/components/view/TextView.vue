<template>
    <div v-if="rawdata.length > 0" class="textview" >
      <template v-for="(c, i) in fixedtext" >
        <span v-if="c[0]==0" :key="'s'+i">{{c[1]}} </span>
        <br v-else-if="c[0]==2" :key="'b'+i"/>
        <span v-else-if="c[0]==1" :key="'h'+i" class="hexascii">{{c[1]}}</span>
      </template>
      <template v-for="(c, i) in fixedtext2" >
        <span v-if="c[0]==0">{{c[1]}} </span>
        <br v-else-if="c[0]==2" :key="'b'+i"/>
        <span v-else-if="c[0]==1" class="hexascii">{{c[1]}}</span>
      </template>
      <template v-for="(c, i) in unfixed">
        <span class="unfixed">{{c[1]}}</span>
      </template>
    </div>
    <div v-else class="nodata">NO DATA</div>
</template>

<script>
import { registerRuntimeCompiler } from 'vue';
import {Functions,BrokenCodeText} from '../../assets/classes';

function conv2RxData(rxdata)
{
  let w=[];
  for(let i of rxdata){
    if((typeof i)=="string"){
      w.push([0,i]);
    }else{
      if(i==0x0a){
        w.push([2]);
        //改行の取り扱い
      }else{
        w.push([1,Functions.toHex(i,2)]);
      }
    }
  }
  return w;
}

export default
  {
    props: {
      rawdata:[]|Uint8Array
    },
    data() {
      return {
        bct:new BrokenCodeText(),
        last_fixed_pos:0,
        parsed_length:0,
        fixedtext:[],
        fixedtext2:[],
        unfixed:[], //[int]
      }
    },
    methods: {
      update()
      {
        let s=this.rawdata.slice(this.parsed_length);
        if(s.length==0){
          return;
        }
        this.parsed_length=this.rawdata.length;
        const fixed=this.bct.fixed;
        this.bct.update(s);
        let fixed_pos=fixed.length;
        if(fixed_pos-1>this.last_fixed_pos){
          //末端-1までを確定キューに淹れる。
          this.fixedtext.push(...conv2RxData(fixed.slice(this.last_fixed_pos,fixed_pos-1)));
          this.last_fixed_pos=fixed_pos-1;
        }
        //末端を確定キュー2に設定
        this.fixedtext2=conv2RxData([fixed[fixed.length-1]]);
        //未確定を設定
        this.unfixed=conv2RxData(this.bct.unfixed);
      },
    },
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

.textview 
{
  .base;
  font-family:monospace;
  padding: .2rem;
  text-align: left;
  overflow-y: scroll;
//  word-break: break-all;
  >span{
    word-wrap:break-word;
    word-break:break-all;
  }
  >.hexascii {
    display:inline-block;
    text-align: center;
    background-color:@gray;
    font-size: 0.45rem;
    width:.9rem;
    margin:0 .1rem;
  }

  >.unfixed {
    text-decoration: underline;
    color: red;
    padding: 0 1px 0 1px;
    font-size: 0.5em;
  }
}
</style>