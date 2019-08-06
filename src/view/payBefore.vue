<script>
import configs from "../config";
import Vue from "vue";
import { createPay } from "../request";
import { Input, Confirm, Accordion, Icon } from "store-vue-ui";

Vue.use(Input)
  .use(Confirm)
  .use(Accordion)
  .use(Accordion.Item)
  .use(Icon);
const instance = {};
instance.name = "vui-pay-before";
instance.props = {};
instance.data = function() {
  return {
    resource: {
      card: require("../images/icon-card.png"),
      wx: require("../images/icon-wx.png"),
      ali: require("../images/icon-ali.png"),
      union: require("../images/icon-union.png")
    },
    params: {
      member: "hjqcl316602",
      money: "0.01",
      type: "1",
      popup: {
        show: false
      }
    },
    options: [
      { text: "银行卡", value: "1" },
      { text: "微信", value: "2" },
      { text: "支付宝", value: "3" },
      { text: "云闪付", value: "4" },
      { text: "支付宝转卡", value: "5" },
      { text: "支付宝转账", value: "6" }
    ],
    moneyOptions: [10, 20, 50, 100, 200, 500, 1000, 2000, 10000]
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
  },
  selectMoney(item) {
    this.params.money = item.toString();
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

    <div class="vc-fluid--h-min vp-bg vc-padding__lg ">
      <div class="vc-margin__lg--bm">
        <div class="vc-text--baseline--lg">
          <span class="vc-text--bold   vc-text--light">充值金额</span>
        </div>
        <div class="vc-margin--bm">
          <vui-input
            border-type="bottom"
            border-weight-type="thin"
            align="right"
            v-model="params.money"
            type="number"
            placeholder="请输入充值金额"
          >
            <div slot="prepend" style="line-height:36px">
              <span class="vc-text--bold   vc-text--light">￥</span>
            </div>
          </vui-input>
        </div>
        <div>
          <div
            class="vui-btn vui-btn--pack vui-btn--radius vui-btn--smaller vc-margin--rt vc-margin--bm"
            v-for="(item, index) in moneyOptions"
            :key="index"
            @click="selectMoney(item)"
          >
            ￥{{ item }}
          </div>
        </div>
      </div>
      <div class="vc-margin__lg--bm">
        <div class="vc-text--baseline--lg">
          <span class="vc-text--bold   vc-text--light">充值方式</span>
        </div>
        <vui-accordion v-model="params.type">
          <vui-accordion-item name="1" :max-height="0">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.card"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">银行卡</span>
              </div>
              <div>
                <vui-icon
                  :size="20"
                  :name="
                    params.type != '1' ? 'check-crilce' : 'radio-button-on'
                  "
                  :color="params.type != '1' ? '#dedede' : '#118eea'"
                ></vui-icon>
              </div>
            </div>
          </vui-accordion-item>
          <vui-accordion-item name="2" :max-height="0">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.wx"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">微信</span>
              </div>
              <div>
                <vui-icon
                  :size="20"
                  :name="
                    params.type != '2' ? 'check-crilce' : 'radio-button-on'
                  "
                  :color="params.type != '2' ? '#dedede' : '#118eea'"
                ></vui-icon>
              </div>
            </div>
          </vui-accordion-item>
          <vui-accordion-item name="3" :max-height="0">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.ali"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">支付宝</span>
              </div>
              <div>
                <vui-icon
                  :size="20"
                  :name="
                    params.type != '3' ? 'check-crilce' : 'radio-button-on'
                  "
                  :color="params.type != '3' ? '#dedede' : '#118eea'"
                ></vui-icon>
              </div>
            </div>
          </vui-accordion-item>

          <vui-accordion-item name="4" :max-height="0">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.union"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">云闪付</span>
              </div>
              <div>
                <vui-icon
                  :size="20"
                  :name="
                    params.type != '4' ? 'check-crilce' : 'radio-button-on'
                  "
                  :color="params.type != '4' ? '#dedede' : '#118eea'"
                ></vui-icon>
              </div>
            </div>
          </vui-accordion-item>

          <vui-accordion-item name="5" :max-height="0">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.ali"
                  alignType="center"
                  :lazy="false"
                  class="vc-margin--rt"
                ></vui-image>
                <vui-icon
                  name="arrow-right"
                  class="vc-margin--rt"
                  color="#dedede"
                ></vui-icon>
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.card"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">支付宝转卡</span>
              </div>
              <div>
                <vui-icon
                  :size="20"
                  :name="
                    params.type != '5' ? 'check-crilce' : 'radio-button-on'
                  "
                  :color="params.type != '5' ? '#dedede' : '#118eea'"
                ></vui-icon>
              </div>
            </div>
          </vui-accordion-item>

          <vui-accordion-item name="6" :max-height="0">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.ali"
                  alignType="center"
                  :lazy="false"
                  class="vc-margin--rt"
                ></vui-image>
                <vui-icon
                  name="arrow-right"
                  class="vc-margin--rt"
                  color="#dedede"
                ></vui-icon>
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.ali"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">支付宝转账</span>
              </div>
              <div>
                <vui-icon
                  :size="20"
                  :name="
                    params.type != '6' ? 'check-crilce' : 'radio-button-on'
                  "
                  :color="params.type != '6' ? '#dedede' : '#118eea'"
                ></vui-icon>
              </div>
            </div>
          </vui-accordion-item>
        </vui-accordion>
      </div>

      <div>
        <div
          class="vui-btn vui-btn--long vui-btn--pack vui-btn--primary vui-btn--radius"
          @click="submit"
        >
          提交
        </div>
      </div>
    </div>
  </div>
</template>

<style   scoped>
</style>