<script>
export default {
  name: "Tag",
  data() {
    return {};
  },
  props: {
    label: {
      type: String
    },
    block: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<template>
  <div
    class='vc-tag'
    :class="{'is-block':this.block }"
  >
    <slot></slot>

    <i class="vc-tag__label">
      {{ label }}
      <slot name='child'></slot>
    </i>

  </div>
</template>

<style   scoped>
</style>