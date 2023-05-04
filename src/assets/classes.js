function clone(v){
    return  JSON.parse(JSON.stringify(v));
}

function assert(exp){
    if(!exp){
        console.error("ASSERT!");
        throw new Error("Assert!");
    }
}

function toHex(value, d) {
    let r = value.toString(16);
    while (r.length < d) {
        r = '0' + r;
    }
    return r;
}


const DEFAULT_SETTING={
    frequency:['8kHz', { freq: 8000 }],
    tone:['SIN', { points: 100, cycle: 1 }]
};

import { TBSKmodemJS } from "tbskmodem-js"
class BrokenCodeText{
    constructor(){
      this._dec=new TBSKmodemJS.utils.BrokenTextStreamDecoder();
      this._contents=[];
    }
    /**
     * 確定した文字列とbyte値
     */
    get fixed(){
      return this._contents;
    }
    /**
     * 未確定のbyte配列
     */
    get unfixed(){
      return this._dec.pending;
    }
    update(n){
      let dec = this._dec; //デコーダー取得
      let contents = this._contents;
      for (let i of n) {
        let darray = dec.update(i);
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
    }
  }

export {
    assert,
    clone,
    toHex,
    BrokenCodeText,
    DEFAULT_SETTING
}
