<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-15 17:34:18
 * @LastEditors: Please set LastEditors
 -->
<script type="text/ecmascript-6">
import { getOrderMessage } from "../request";

export default {
  name: "PagePayStatus",
  components: {},

  data() {
    return {
      params: {
        accessToken: "",
        appId: "",
        status: "",
        money: "",
        createTime: "",
        orderSn: "",
        payTime: "",
        channelOrderId: "",
        payMode: "",
        orderId: ""
      }
    };
  },
  mounted() {
    this.initPage();
  },
  methods: {
    /**
     * 页面初始化
     */
    async initPage() {
      this.params = Object.assign(this.params, this.$route.params);
      let message = await getOrderMessage({
        accessToken: this.params.accessToken
      });
      this.params = Object.assign(this.params, message);
    },
    toCustomer() {
      this.$router.push({
        name: "CustomDetail",
        params: {
          appId: this.params.appId,
          accessToken: this.params.accessToken
        },
        query: { orderId: this.params.orderId }
      });
    }
  }
};
</script>
<template>
  <div class="vv-page">
    <div class="vv-side">
      <div class="vv-side-item vc-text--warning" @click="toCustomer">
        <span>客服</span>
        <i class="iconfont icon-customer" style="font-size:16px"></i>
      </div>
    </div>
    <div class="vc-fluid--h-min vp-bg" style="padding: 20px 20px 70px">
      <div class="vp-ratio">
        <div class="vp-ratio__outer" data-ratio="75%">
          <div class="vp-ratio__inner vp-bg vc-flex--center">
            <div v-if="params.status === 3">
              <div>
                <img
                  src="../images/icon-pay-success.png"
                  alt=""
                  style="width: 100px;"
                />
              </div>

              <div
                class="vc-margin--tp vc-text--bold vc-text--center"
                style="color: #65DA51;font-size: 18px;"
              >
                充值成功
              </div>
            </div>
            <div v-if="params.status === 2">
              <div>
                <img
                  src="../images/icon-pay-success.png"
                  alt=""
                  style="width: 100px;"
                />
              </div>

              <div
                class="vc-margin--tp vc-text--bold vc-text--center"
                style="color: #65DA51;font-size: 18px;"
              >
                已付款
              </div>
            </div>
            <div v-if="params.status === 1">
              <div>
                <img
                  src="../images/icon-pay-success.png"
                  alt=""
                  style="width: 100px;"
                />
              </div>

              <div
                class="vc-margin--tp vc-text--bold vc-text--center"
                style="color: #65DA51;font-size: 18px;"
              >
                未付款
              </div>
            </div>
            <div v-if="params.status === 0">
              <div>
                <img
                  src="../images/icon-pay-error.png"
                  alt=""
                  style="width: 100px;"
                />
              </div>

              <div
                class="vc-margin--tp vc-text--bold vc-text--center "
                style="color:#d81e06;font-size: 18px;"
              >
                充值取消
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class=" ">
        <div class="">
          <template v-if="params.money">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">充值状态</span>
              <span class="vc-text--lg"
                >{{ params.status | strPayStatus }}
              </span>
            </div>
          </template>
          <template v-if="params.money">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">充值金额</span>
              <span class="vc-text--lg">{{ params.money }}元</span>
            </div>
          </template>
          <template v-if="params.payMode">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">充值方式</span>
              <span class="vc-text--lg">{{ params.payMode }}</span>
            </div>
          </template>

          <template v-if="params.channelOrderId">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">订单编号</span>
              <span class="vc-text--lg">{{ params.channelOrderId }}</span>
            </div>
          </template>
          <template v-if="params.orderSn">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">流水号</span>
              <span class="vc-text--lg">{{ params.orderSn }}</span>
            </div>
          </template>
          <template v-if="params.createTime">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">订单时间</span>
              <span class="vc-text--lg">{{ params.createTime }}</span>
            </div>
          </template>
          <template v-if="params.payTime">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">完成时间</span>
              <span class="vc-text--lg">{{ params.payTime }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
