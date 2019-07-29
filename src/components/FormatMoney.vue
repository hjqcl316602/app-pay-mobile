<script>
export default {
  name: "FormatMoney",
  props: {
    money: [String, Number],
    moneyType: {
      type: [String],
      default: "primary" // 分为元（primary）和分（branch）
    }
  },
  data() {
    return {
      value: "9999999999999" // test
    };
  },
  computed: {
    size() {
      console.log(this.money)
      if (this.moneyType == "branch") {
        if (Number.isNaN(Number(this.money)) || this.money < 100000) {
          return 40;
        } else if (this.money < 1000000) {
          return 32;
        } else if (this.money < 10000000) {
          return 26;
        } else if (this.money < 100000000) {
          return 22;
        }else if (this.money < 1000000000) {
          return 18;
        }
        return 16;
      }else if (this.moneyType == "primary") {
        if (Number.isNaN(Number(this.money)) || this.money < 1000) {
          return 40;
        } else if (this.money < 10000) {
          return 32;
        } else if (this.money < 100000) {
          return 26;
        } else if (this.money < 1000000) {
          return 22;
        }else if (this.money < 10000000) {
          return 18;
        }
        return 16;
      }
    }
  }
};
</script>

<template>
  <span
    class="vc-format-money"
    :style="{'fontSize':size+'px'}"
  >{{ money | strMoney('branch') }}</span>
</template>

<style   scoped>
</style>