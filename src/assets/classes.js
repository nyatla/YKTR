const VERSION={
  name:"YKTR",
  major:0,
  miner:1,
  patch:1,
  toString:()=>{
    return `${VERSION.name}/${VERSION.major}.${VERSION.miner}.${VERSION.patch}`;
  }
};

const Functions={
  toHex:(value, d)=>{
    // console.log("WHY");
    let r = value.toString(16);
    while (r.length < d) {
        r = '0' + r;
    }
    return r;
  },
  formattedDate:(d)=>{
    return d.toLocaleDateString(navigator.language);
  },
  formattedTime:(d)=>{
    return d.toLocaleTimeString(navigator.language, { hour12: false ,hour: 'numeric', minute: '2-digit'});
  },
  formatFreq:function(s){
    let w=s.toFixed();
    let d=0;
    for(let i=w.length-1;i>=0;i--){
      if(w[i]==0){
        d++;
      }else{
        break;
      }
    }
    let ret=w+" Hz";
    let tmp=undefined;
    if(d>=3){
      //3桁以上ならkHz表示
      tmp=w.slice(0,w.length-3)+" kHz";
    }else{
      tmp=w.slice(0,-3)+"."+w.slice(-3,d==0?undefined:-d)+" kHz";
    }
    if(tmp!==undefined && tmp.length<=ret.length){
      ret=tmp;
    }
    return ret;
  },
}

function clone(v){
    return  JSON.parse(JSON.stringify(v));
}

function assert(exp){
    if(!exp){
        console.error("ASSERT!");
        throw new Error("Assert!");
    }
}



/**
 * Generated by ChatGPT
 * @param {*} array 
 * @param {*} condition 
 * @returns 
 */
function findIndexByCondition(array, condition) {
  for (var i = 0; i < array.length; i++) {
    if (condition(array[i])) {
      return i;
    }
  }
  return -1;
}


class Spec{
  constructor(name){
    this.name=name;
  }
}
class FrequencySpec extends Spec{
  constructor(freq){
    super(`${Math.floor(freq/1000)}Hz`);
    this.freq=freq;
  }
}


class ToneSpec extends Spec{
  constructor(name,points,cycle){
    super(name);
    this.points=points;
    this.cycle=cycle;
  }
  get ticks(){
    return this.points*this.cycle;
  }
  /**
   * 同じ型のインスタンスから値をコピーする
   * @param {*} src 
   */
  copyFrom(src){
    throw new Error();
  }
  createInstance(tbsk){
    throw new Error();
  }
}
class SinToneSpec extends ToneSpec{
  constructor(points=10,cycle=10){
    super("SIN",points,cycle);
  }
  copyFrom(src){
    this.points=src.points;
    this.cycle=src.cycle;
  }
  createInstance(tbsk){
    return new tbsk.SinTone(this.points,this.cycle);
  }
}
class XpskSinToneSpec extends ToneSpec{
  constructor(points=10,cycle=10,div=8){
    super("XPSK",points,cycle);
    this.div=div;
  }
  copyFrom(src){
    this.points=src.points;
    this.cycle=src.cycle;
    this.div=src.div;
  }
  createInstance(tbsk){
    return new tbsk.XPskSinTone(this.points,this.cycle,this.div);
  }
}
/**
 * 変調パラメータのスペック値を格納する
 */
class ModulationSpec
{
  /**
   * 
   * @param {int} preamble_cycle 
   * @param {FrequencySpec} frequency 
   * @param {ToneSpec} tone 
   */
  constructor(preamble_cycle,freqspec,tonespec){
    this.preamble={cycle:preamble_cycle};
    this.frequency=freqspec;
    this.tone=tonespec;
  }
  get baud(){
    return this.frequency.freq/(this.tone.ticks);
  }
}
const DEFAULT_SETTING=new ModulationSpec(4,new FrequencySpec(8000),new SinToneSpec());




class StatusData{
  constructor(sid,type){
    this.sid=sid;
    this.type=type;
    this.datetime=new Date();
    this.cache={};//データキャッシュ
    this.ref=null;
  }
}
class RxStatusData extends StatusData{
  constructor(sid,setting){
    super(sid,"rx");
    this.setting=setting;
    this.rawdata=[];  //追記のみの受信データ
    this.fixed=false; //受信済フラグ
    this.cache.bct=new BrokenCodeText();
  }
  push(d){
    this.rawdata.push(...d);
    this.cache.bct.update(d);
  }
  /**
   * この値は追記データ.
   */
  get fixedData(){
    return this.cache.bct.fixed;
  }
  /**
   * この値は追記データではない
   */
  get unfixedData(){
    return this.cache.bct.unfixed;
  }
}

class TxStatusData extends StatusData{
  constructor(sid,setting){
    super(sid,"tx");
    this.setting=setting;
    this.rawdata=[];  //追記のみの送信データ
    this._state="new";//new,modulate,transmit,break,completeの何れか
    this._fixed=false;//送信済みフラグ
    this.cache.bct=new BrokenCodeText();
    this.cache.tx_txdata=0;
  }
  push(d){
    this.rawdata.push(...d);
    this.cache.bct.update(d);
  }
  get state(){
    return this._state;
  }
  set state(v){
    console.log(v);
    assert(["new","modulate","transmit","break","complete"].includes(v));
    this._state=v;
  }
  get fixed(){
    return ["break","complete"].includes(this._state);
  }
  /**
   * この値は追記データ.
   */
  get fixedData(){
    return this.cache.bct.fixed;
  }
  /**
   * この値は追記データではない
   */
  get unfixedData(){    
    return this.cache.bct.unfixed;
  }
}



class StatusDataList{
  constructor(){
    this.items=[];
    this._sid_counter=0;
  }
  /**
   * sidに一致したアイテムを返すの。
   * @param {*} sid 
   * @returns 
   */
  statusOfSid(sid){
    let status = this.items.find(item => item.sid == sid);
    return status;
  }
  indexOfSid(sid){
    return findIndexByCondition(this.items,item => item.sid == sid);
  }

  newRx(current_setting){
    const i=new RxStatusData(this._sid_counter++,current_setting);
    this.items.push(i);
    return i;
  }
  newTx(current_setting){
    const i=new TxStatusData(this._sid_counter++,current_setting);
    this.items.push(i);
    return i;
  }    

}

/**
 * シリアライズ可能なアプリケーションデータ
 */
class Application{
  constructor(res){
    this.version=VERSION;
    this.res=res;
    /**
     * この値はイミュータブルであること。
     */
    this.current_setting=new ModulationSpec(
      4,
      new FrequencySpec(16000),
      new XpskSinToneSpec(10,10)
    );
    this.statuses=new StatusDataList();//ステータス
    this.env={
      dont_show_again_ios_warn:undefined  //
    };
  }
}









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
            } else {;
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
    Application,
    assert,
    clone,
    Functions,
    BrokenCodeText,
    DEFAULT_SETTING,
    ModulationSpec,FrequencySpec,XpskSinToneSpec,SinToneSpec,
}
