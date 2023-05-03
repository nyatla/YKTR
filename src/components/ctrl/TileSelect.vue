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
            this.$emit('selected-event', {index:newVal,title:this.titles[newVal],value:this.items[newVal]});
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
  }

  li {
    list-style: none;
    text-align: center;
  }

  .tabs {
    overflow: hidden;
  }

  .tabs li {
    display: inline-block;
    align-items: center;
    width: 4rem;
    height: 1rem;
    padding: .1rem;
    cursor: pointer;
    transition: .2s;
    font-size: 0.5rem;
  }

  .tabs li:not(:first-child),
  .tabs:not(:first-of-type) {
    border-left: none;
  }

  .tabs li.active,
  .tabs :checked {
    font-size: 0.8rem;
    font-weight: bold;
    cursor: auto;
    background-color: @yellow;
  }
</style>