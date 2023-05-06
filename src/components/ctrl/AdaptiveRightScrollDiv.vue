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
        // text: {
        //     type: String,
        //     default: ''
        // },
        speed:{
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            offset: 0,
            mode:0,
        }
    },
    watch: {
        // '$slots.foo': function (v) {
        //     this.updateTextWidth()
        // }
    },
    mounted() {
        this.$nextTick(() => {
            this.startAnimation()
        })
        window.addEventListener('resize', this.handleResize)
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize)
        this.stopAnimation()
    },
    methods: {
        updateTextWidth()
        {
            this.mode=0;
        },
        handleResize() {
            this.mode=1;
        },

        startAnimation() {
            this.animationFrame = requestAnimationFrame(this.scrollContent)
        },
        stopAnimation() {
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
            let rpadding=textwidth-screenwidth+offset;
            switch(this.mode){
            case 0:
                if(rpadding>0){
                    this.offset -= rpadding>step?step:rpadding;
                }
                break;
            case 1:
                if(rpadding>0){
                    this.offset -= rpadding>step?step:rpadding;
                }else if(rpadding<0 && this.offset<0){
                    this.offset += -rpadding>step?step:-rpadding;;
                }
                break;
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