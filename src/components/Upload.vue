<script>
export default {
  name: "upload",
  data() {
    return {};
  },
  props: {
    accept: {
      type: String,
      default: "image/*"
    }
  },
  methods: {
    selectFile(e) {
      let file = e.target.files[0];
      let formData = new FormData();
      formData.append("file", file);
      this.$emit("change", formData);
    }
  }
};
</script>



<template>

  <!-- <input type="file" accept="video/*;capture=camcorder"> 
<input type="file" accept="audio/*;capture=microphone">
<input type="file" accept="image/*;capture=camera">直接调用相机
<input type="file" accept="image/*" />调用相机 图片或者相册 -->

  <div class="vc-ratio">
    <div
      class="vc-ratio__outer"
      data-ratio='100%'
    >
      <div class="vc-ratio__inner vc-upload">

        <label
          for="upload"
          class="vc-upload--label"
        >
          <input
            type="file"
            id=upload
            style='display:none;'
            :accept="accept"
            @change="selectFile"
          ><svg
            t="1555316754664"
            class="icon"
            style=""
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4860"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="100%"
            height="100%"
            fill="#555"
          >
            <path
              d="M158.2 158.5h707.6c20.3 0 36.6 16.3 36.6 36.6v288.7c-36.6-28.5-105.7-73.2-158.6-73.2-77.3 0-146.4 178.9-231.8 178.9-65.1-4.1-154.5-77.3-256.2-65.1-40.7 8.1-97.6 73.2-134.2 122V195.1c0-20.4 16.3-36.6 36.6-36.6zM329 451.3c-32.5 0-61-12.2-81.3-32.5s-32.5-52.9-32.5-81.3c0-28.5 12.2-61 32.5-81.3 20.3-20.3 48.8-32.5 81.3-32.5 28.5 0 56.9 12.2 81.3 32.5 20.3 20.3 32.5 52.9 32.5 81.3 0 28.5-12.2 61-32.5 81.3-24.4 20.3-52.8 32.5-81.3 32.5z m557.1-345.7H137.9c-40.7 0-73.2 32.5-73.2 73.2v666.9c0 40.7 32.5 73.2 73.2 73.2h748.3c40.7 0 73.2-32.5 73.2-73.2V178.8c-0.1-40.7-32.6-73.2-73.3-73.2z m0 0"
              p-id="4861"
            ></path>
          </svg>
        </label>

      </div>
    </div>
  </div>
  <!-- 
  <svg
    v-if='false'
    t="1554779705914"
    class="icon"
    style=""
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="7580"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="100%"
    height="100%"
  >
    <path
      d="M576 256L448 128H0v832h1024V256H576zM512 480l224 224H576v256H448v-256H288L512 480z"
      p-id="7581"
    ></path>
  </svg> -->

</template>

<style   scoped>
</style>

