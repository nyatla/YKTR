<!--    左スクロールマーキーコンポーネント
-->
<template>
    <div class="marquee" ref="marquee">
        <!-- <div class="text" :style="{ width: textWidth + 'px', transform: 'translateX(' + offset + 'px)' }">{{ text }}</div> -->
        <div class="text" ref="text" :style="{transform: 'translateX(' + offset + 'px)' }">
            <slot name="contents"></slot>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        speed:{
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            offset: 0,
            /**
             * 0:左詰めで右端まで表示。溢れたら左スクロール。
             * 1:左スクロールして右端がスクロールアウトしたら左端から再表示して停止。
             * 2:右端から左端迄を右端外から左スクロール。
             * 10:左端固定
             * 11:中央固定
             * 12:右端固定
             */
             _mode:0,////
             _reset_requred:false,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this._startAnimation()
        })
        window.addEventListener('resize', this._handleResize)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this._handleResize)
        this._stopAnimation()
    },
    methods:
    {
        setMode(m,reset=false)
        {
            //次の描画タイミングでリセットする。
            this._reset_requred=reset;
            this._mode=m;
        },
        _handleResize() {
//            this.mode=0;
        },
        _startAnimation() {
            this.animationFrame = requestAnimationFrame(this.scrollContent)
        },
        _stopAnimation() {
            cancelAnimationFrame(this.animationFrame)
            this.animationFrame = null
        },
        scrollContent()
        {
            let offset=this.offset;
            let textwidth=this.$refs.text.scrollWidth;
            let screenwidth=this.$refs.marquee.offsetWidth;
            let step=this.speed*this.$refs.text.scrollHeight/10;
            console.log(textwidth);
            if(this._reset_requred){
                switch(this._mode){
                case 11:
                    this.offset=Math.floor((screenwidth-textwidth)*0.5);
                    break;
                case 10:
                case 0:
                    this.offset=0;
                    break;
                case 1:
                case 2:
                    this.offset=textwidth;
                    break;
                }
                //コンテンツ幅が0の場合はレンダリング待ちのためにリセットしない
                if(textwidth!=0){
                    this._reset_requred=false;                    
                }
            }
            switch(this._mode){
                case 0:{
                    let rpadding=textwidth-screenwidth+offset;//右端のhiddn幅
                    //左端優先で右端に揃える
                    if(rpadding>0){
                        this.offset -= rpadding>step?step:rpadding;
                    }else if(rpadding<0 && this.offset<0){
                        this.offset += -rpadding>step?step:-rpadding;;
                    }
                    break;
                }
                case 1:{
                    //左端までスクロールしていたらもどす？
                    if(textwidth+offset<0){
                        this.offset=0;
                        offset=0;
                    }

                    //右端をスクロールアウトして左端を再表示する。
                    let rpadding=textwidth+offset;//右端のhidden幅
                    if(offset<0){
                        if(rpadding>0){
                            this.offset -= rpadding>step?step:rpadding;
                        }else if(rpadding<=0){
                            this.offset = Math.floor(screenwidth*1.1);
                        }
                    }else if(offset!=0){
                        this.offset -= step;
                        if(this.offset<0){
                            this.offset=0;
                        }
                    }
                    break;
                }
                case 11:{
                    let coffset=Math.floor((screenwidth-textwidth)*0.5);
                    if(coffset!=this.offset){
                        this.offset=coffset;
                    }
                    break;
                }
                case 10:
                    break;

            }
//            console.log("mode",this._mode);
            this.animationFrame = requestAnimationFrame(this.scrollContent);
        },
    }
}
</script>

<style scoped>
.marquee {
    margin: 0;
    padding: 0;
    text-align: left;
    position: relative;
    height: 100%;
    overflow: hidden;
}

.text {
    display:inline-block;
    white-space: nowrap;
    position: absolute;
}
</style>