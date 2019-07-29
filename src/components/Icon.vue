
<script>
export default {
  name: 'Icon',
  data() { 
    return {

    }
  },
  props:{
    size:{
      type:Number,
      default:14
    },
    color:{
      type:String,
      default:'#333'
    },
    name:{
      type:String, 
    }
  },
  computed:{
    style(){
      return {
        fontSize:this.size + 'px',
        color:this.color
      }
    },
    className(){
      let className = 'vc-iconfont iconfont ' + this.name;
      return className
    }
  }
 }
</script>

<template>
  <i :class="className" :style='style'></i>
</template>

<style   scoped>
</style>