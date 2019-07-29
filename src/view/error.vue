<script>
export default {
  name: "error",
  data() {
    return {
      message: ""
    };
  },
  mounted() {
    this.message = this.$route.query["msg"]
      ? decodeURIComponent(this.$route.query["msg"])
      : "系统繁忙，请稍后重试！";
  }
};
</script>

<template>
  <div
    class="vv-page vv-page--cover vp-error vc-flex--center vc-direction--column  "
  >
    <div class="vc-margin__lg--bm">
      <img src="../images/icon-pay-error.png" alt="" style="width: 100px;" />
    </div>

    <div style="margin-bottom:100px">
      <span class="vc-text--dark vc-text--lg">{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
</style>