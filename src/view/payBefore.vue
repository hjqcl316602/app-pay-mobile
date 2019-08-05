<script>
import configs from "../config";
import Vue from "vue";
import { createPay } from "../request";
import { Input, Confirm } from "store-vue-ui";

Vue.use(Input).use(Confirm);
const instance = {};
instance.name = "vui-pay-before";
instance.props = {};
instance.data = function() {
  return {
    params: {
      member: "hjqcl316602",
      money: "10",
      type: 1,
      popup: {
        show: false
      }
    },
    options: [
      { text: "银行卡", value: 1 },
      { text: "微信", value: 2 },
      { text: "支付宝", value: 3 },
      { text: "云闪付", value: 4 },
      { text: "支付宝转银行卡", value: 5 },
      { text: "支付宝转账", value: 6 }
    ]
  };
};
instance.methods = {
  changeOption(item) {
    this.params.type = item["value"];
  },
  submit() {
    if (this.params.money === "") {
      this.$message.danger("充值失败，请输入金额");
    } else {
      this.params.popup.show = true;
    }
  },
  confirmPopupSubmit() {
    location.href =
      configs["HTTP_REQUEST"] +
      "/test/createUrl.do?channelId=" +
      this.params.type +
      "&fee=" +
      Number(this.params.money) * 100;
    // createPay(params).then(res => {
    //   console.log(res);
    // });
  }
};
instance.created = function() {};
instance.mounted = function() {};
export default instance;
</script>

<template>
  <div class="vui-pay-before vv-page">
    <vui-confirm
      v-model="params.popup.show"
      title="充值信息确认"
      @ok="confirmPopupSubmit"
    >
      <div class="vc-padding">
        <div class="vc-flex vc-margin--bm">
          <span class="vc-text--right vc-text--light" style="width:80px"
            >金额</span
          >
          <span class="vc-padding--lt">{{ params.money }}</span>
        </div>
        <div class="vc-flex">
          <span class="vc-text--right vc-text--light" style="width:80px"
            >方式</span
          >
          <span class="vc-padding--lt">{{
            this.options.find(el => {
              return el.value === params.type;
            })["text"]
          }}</span>
        </div>
      </div>
    </vui-confirm>
    <div class="vc-fluid--h-min vp-bg vc-padding ">
      <div class="vc-flex--between-center vc-padding vc-margin__lg--bm">
        <span class="vc-text--bold   vc-text--light">账号</span>
        <span>{{ params.member }}</span>
      </div>
      <div class="vc-margin__lg--bm">
        <vui-input
          border-type="bottom"
          border-weight-type="thin"
          align="right"
          v-model="params.money"
          type="number"
          placeholder="请输入充值金额"
        >
          <div slot="prepend" style="line-height:36px">
            <span class="vc-text--danger">*</span>
            <span class="vc-text--bold   vc-text--light">金额</span>
          </div>
        </vui-input>
      </div>
      <div class="vv-options vc-margin__lg--bm">
        <div
          class="vv-option "
          :class="{ 'vv-option--active': item['value'] === params.type }"
          v-for="(item, index) in options"
          :key="index"
          @click="changeOption(item)"
        >
          {{ item["text"] }}
        </div>
      </div>
      <div class="">
        <div class="vp-btn vp-btn__submit" @click="submit">提交</div>
      </div>
    </div>
  </div>
</template>

<style   scoped>
</style>