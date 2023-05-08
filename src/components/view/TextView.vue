<template>
    <div class="textview" v-if="rawdata.length > 0">
      <span v-for="(c, i) in fixed" v-bind:key="i" :class="{ 'hexascii': (typeof c) != 'string' }">{{ ((typeof c) == 'string') ? c : toHex(c, 2) }}</span>
      <span class="unfixed" v-for="(c, i) in unfixed" v-bind:key="i">{{ toHex(c, 2) }}</span>
    </div>
    <div class="nodata" v-if="rawdata.length == 0">NO DATA</div>
</template>

<script>
import {BrokenCodeText,toHex} from "../../assets/classes"


export default
  {
    props: {
      rawdata:Array
    },
    data() {
      return {
          _dec:undefined,
          fixed:undefined,
          unfixed:undefined,
      }
    },
    watch: {
      rawdata:{
        handler(new_,old_) {
          if(old_===undefined || new_.length<=old_.length){
            this._dec=new BrokenCodeText();
            this._dec.update(new_);
          }else{
            this._dec.update(new_.slice(old_.length));
          }
          this.fixed=this._dec.fixed;
          this.unfixed=this._dec.unfixed;
        },
        immediate:true,
        deep:true//暫定実装。パフォーマンスに影響があるのででっかい配列の場合は処理を切り替えて
      }
    },
    methods: {
      toHex:toHex,
    },
    computed: {
      fixedText() {
        let d = this.decoder; //デコーダー取得
        let n = this.rawdata.slice(d.pt);//未解析の配列
        let contents = this.contents;
        for (let i of n) {
          let darray = d.dec.update(i);
          if (darray == null) {
            continue;
          }
          for (let j = 0; j < darray.length; j++) {
            if ((typeof darray[j]) == 'string') {
              let cv = darray[j].charCodeAt();
              if (cv >= 256 || (cv >= 32 && cv != 127)) {
                if (contents.length == 0 || (typeof contents[contents.length - 1]) != 'string') {
                  contents.push("");//新しい文字列ブロック
                }
                contents[contents.length - 1] += darray[j];//文字列
              } else {
                contents.push(cv);//16進数
              }
            } else {
              contents.push(darray[j]);//16進数
            }
          }
        }
        d.pt += n.length;

        return contents;
      },
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