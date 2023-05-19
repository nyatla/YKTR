<!--    左スクロールマーキーコンポーネント
-->
<template>
    <ul class="tabs">
        <li v-for="(r, i) in titles" v-bind:key="i" v-on:click="selectedIndex=i" v-bind:class="{ 'active': selectedIndex === i }">{{r}}</li>
    </ul>
</template>
  
<script>

export default {
    props: {
        name:{
            type:String,
            default:"TileSelect"
        },
        items:Array,// ["a","b","c","d"] or [["name",{value:v}]]
        defaultSelectedIndex:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
            titles:[],
            selectedIndex:this.defaultSelectedIndex,            
        }
    },
    watch: {
        items:{
            immediate: true,
            handler(newVal, oldVal) {
                let r=[];
                for(let i=0;i<newVal.length;i++){
                    let item=newVal[i];
                    r.push(Array.isArray(item)?item[0]:item);
                }
                this.titles=r;
            }
        },
        selectedIndex:function(newVal){
            this.$emit('event-selected', {
                name:this.name,
                index:newVal,
                title:this.titles[newVal],
                value:this.items[newVal]
            });
        }
    },
    methods: {
    },

    }
</script>

<style scoped lang="less" >
@import "@/assets/global.less";
    ul {
        margin: 0;
        padding: 0;
        user-select: none;
        display: flex;
    }
    li {
        // display: inline-block;
        display: flex;
        list-style: none;
        text-align: center;
        height: 1.2rem;
        font-size: 0.6rem;
        width: 4.5rem;
        vertical-align: middle;
        align-items: center;
        justify-content: center;        
        cursor: pointer;
        overflow: hidden;
        transition: .2s;    
    }


    
  .tabs li:not(:first-child),
  .tabs:not(:first-of-type) {
    border-left: none;
  }

    .tabs li.active,.tabs :checked {
        font-size: 0.8rem;
        font-weight: bold;
        cursor: auto;
        background-color: @yellow;
    }
</style>