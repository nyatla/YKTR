const Functions={
  toHex:(value, d)=>{
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
  }
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

function toHex(value, d) {
    let r = value.toString(16);
    while (r.length < d) {
        r = '0' + r;
    }
    return r;
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
  createInstance(tbsk){
    throw new Error();
  }
}
class SinToneSpec extends ToneSpec{
  constructor(points=10,cycle=10){
    super("SIN",points,cycle);
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


/**
 * シリアライズ可能なアプリケーションデータ
 */
class Application{
  constructor(){
    this.version;
    this.current_setting=undefined;
    console.log("Application created");
//    this._statuses;
  }
}

class StatusData{
  constructor(sid,type){
    this.sid=sid;
    this.type=type;
    this.datetime=new Date();
    this.cache={};//データキャッシュ
  }
}
class RxStatusData extends StatusData{
  constructor(sid){
    super(sid,"rx");
    this.rawdata=[];
    this.fixed=false;//受信済フラグ
    this.cache._dec=new BrokenCodeText();
  }
}

class TxStatusData extends StatusData{
  constructor(sid){
    super(sid,"tx");
    this.rawdata=[];
    this.fixed=false;//送信済みフラグ
    this.cache.mode=0;    //表示モード(0=メッセージ,1=データ)
    this.cache.message="";//表示モード0の時のメッセージ
  }
}

  
class StatusDataBuilder{
    constructor(){
        this._sid_counter=0;
    }
    newRx(){
        return new RxStatusData(this._sid_counter++);
    }
    newTx(){
      return new TxStatusData(this._sid_counter++);
  }    
}








//ダミーデータ生成インスタンス
class DummyData{
    constructor(){
        this._sb=new StatusDataBuilder();
    }
    rxDummyData(){
        console.log("generated");
        let s=this._sb.newRx();
        s.rawdata.push(52,53,54,55,56);
        return s;
    }
    txDummyData(){
      let s=this._sb.newTx();
      s.rawdata.push(52,53,54,55,56);
      return s;
  }

}
const dbg=new DummyData();



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
    Application,
    assert,
    clone,
    toHex,
    dbg,
    Functions,
    RxStatusData,StatusDataBuilder,
    BrokenCodeText,
    DEFAULT_SETTING,
    ModulationSpec,FrequencySpec,XpskSinToneSpec,SinToneSpec,
}
