<script>
export default {
  name: 'Ratio',
  props:{
    ratio:{
      type:Number,
      default:1
    }
  },
  computed:{
    style(){
      return {
        'paddingTop':100 / this.ratio + '%'
      }
    }
  },
  data(){ 
    return {

    }
  }
 }
</script>

<template>
  <div class="vc-ratio">
    <div class="vc-ratio__outer" :style="style">
      <div class="vc-ratio__inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style   scoped>
</style>