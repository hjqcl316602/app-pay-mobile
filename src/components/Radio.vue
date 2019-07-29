<script type="text/ecmascript-6">
//import { VaPopupRadio }  from './component'
//import user  from '../vue.mixins/user'
export default {
  name: "Radio",
  components: {},
  mixins: [],
  data() {
    return {
      currentValue: 0
    };
  },
  mounted() {},
  activated() {},
  props: {
    options: {
      type: Array,
      default: _ => {
        return [];
      }
    },
    value: {
      type: [Number, String],
      default: "1"
    }
  },
  methods: {
    changeRadio(item, i) {
      if (this.currentValue == item["value"]) {
        this.currentValue = "";
      } else {
        this.currentValue = item["value"];
      }
      this.$emit("select", this.currentValue);
    }
  },
  watch: {
    value: {
      handler(val, olval) {
        this.currentValue = val;
      },
      deep: true,
      immediate: true
    },
    currentValue(val) {
      this.$emit("input", val);
    }
  }
};
</script>
<template>
  <div class="vc-radio">
    <div v-for="(item, i) in options" class="" :key="i">
      <div
        class="vc-flex--between-center vc-border--bm vc-padding--ud"
        @click="changeRadio(item, i)"
      >
        <div class="vc-icon__outer">
          <i class="vc-icon" :class="'vc-icon--' + item['className']"></i>
          <span class="vc-margin--lt ">{{ item["text"] }}</span>
        </div>
        <i
          class="vc-icon vc-icon--select"
          :class="{ 'vc-icon--selected': item['value'] === currentValue }"
        ></i>
      </div>
      <slot :name="item['value']" v-if="item['value'] === currentValue"></slot>
      <!--<i class="vc-radio__icon vc-margin&#45;&#45;rt iconfont " :class="{'icon-radio-button-on':item['value'] === currentValue ,'icon-radio-button-off-out':item['value'] !== currentValue}"></i>
      <span class="vc-raio__message " >{{ item['text']}}</span>-->
    </div>
  </div>
</template>
<style scoped></style>
