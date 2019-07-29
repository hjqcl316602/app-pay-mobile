<script>
let defaultSrc = require("../images/img-error-loading.png");

export default {
  name: "Image",
  props: {
    circle: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "max" // 可选 [ max , cover, cover-height,cover-width ]
    },
    align: {
      type: String,
      default: "center"
    },
    src: {
      type: String,
      default: ""
    },
    defaultSrc: {
      type: String,
      default: defaultSrc
    },
    circle: {
      type: Boolean,
      default: false
    },
    
  },
  computed: {
    className() {
      return "vc-image__normal is-" + this.type + " is-" + this.align;
    }
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.$refs["image"]);
    // let image = new Image();
    // image.src = this.src;
    // image.onload = e => {
    //   console.log(e);
    //   setTimeout(() => {
    //     this.$refs["image"].src = image.src;
    //   }, 2000);
    // };
    // image.onerror = e =>{
    //   console.log(e);
    // }
  }
};
</script>

<template>
  <div class="vc-image" :class="{ 'is-circle':circle}">
    <img
      :src = 'src'
      alt=""
      :class='className'
      ref='image'
    >
    <img
      :src="defaultSrc"
      alt=""
      class="vc-image__default"
    >
  </div>
</template>

<style   scoped>
</style>