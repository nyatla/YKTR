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
        }
        
    },
    data() {
        return {
            offset: 0,
            mode:0,//0:右端まで表示。//1右端を表示し終わったら左端から標示
        }
    },
    watch: {
        // '$slots.foo': function (v) {
        //     this.updateTextWidth()
        // }
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
        fix(){//固定モードに移行する。
            this.mode=1;
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
            if(textwidth+offset<0){
                this.offset=0;
                offset=0;
            }
            switch(this.mode){
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

            }
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