<script type="text/ecmascript-6">
import { getOrderMessage } from "../request";

const GET_PAY_STATUS = 5 * 1000;

export default {
  name: "PageDrawtatus",
  components: {},
  data() {
    return {
      params: {
        money: "",
        payMode: "", // 1 - 银行卡 2 - 微信 3 - 支付宝 4 - 合并,
        orderSn: "",
        createTime: "",
        payTime: "",
        status: "",
        channelOrderId: "", // 流水号,

        timer: null
      },

      options: {
        status: ["已取消", "未付款", "已付款", "已完成", "申诉中"],
        statusMessage: [
          "已取消",
          "等待付款...",
          "已成功付款",
          "订单已完成",
          "订单申诉中..."
        ]
      },

      accessToken: ""
    };
  },
  mounted() {
    this.init();
  },
  activated() {},
  methods: {
    async init() {
      this.accessToken = this.$route["params"]["accessToken"];
      this.setPayStatusTimer();
    },

    /**
     * 获取支付状态
     */

    getPayStatus() {
      getOrderMessage({ accessToken: this.accessToken }).then(res => {
        this.params = Object.assign(this.params, res);
      });
    },

    confirmWithdraw() {
      this.$dialog
        .confirm({
          title: "确认信息",
          message: "您是否确定已收到款项？"
        })
        .then(() => {
          this.clearPayStatusTimer();
          this.$confirmWithdraw({ accessToken: this.accessToken }).then(
            response => {
              this.setPayStatusTimer();
            }
          );
        })
        .catch(() => {});
    },
    // 设置支付成功与否的状态定时器
    setPayStatusTimer() {
      this.getPayStatus();
      this.params.timer = null;
      this.params.timer = setInterval(() => {
        if (this.params.status === 3 || this.params.status === 0) {
          this.clearPayStatusTimer();
        } else {
          this.getPayStatus();
        }
      }, GET_PAY_STATUS);
    },

    // 清除支付定时器
    clearPayStatusTimer() {
      clearInterval(this.params.timer);
      this.params.timer = null;
    }
  },
  beforeDestroy() {
    this.clearPayStatusTimer();
  },
  watch: {
    "": {
      handler(val, olval) {},
      deep: true,
      immediate: true
    }
  }
};
</script>
<template>
  <div class="vv-page">
    <div class="vc-fluid--h-min vp-bg vc-padding__lg">
      <div class="vp-ratio ">
        <div class="vp-ratio__outer" data-ratio="75%">
          <div class="vp-ratio__inner  vc-flex--center">
            <div v-if="params.status === 0">
              <div>
                <img
                  src="../images/icon-pay-error.png"
                  alt=""
                  style="width: 100px;"
                />
              </div>
              <div
                class="vc-margin--tp vc-text--bold vc-text--center"
                style="color: #d81e06;font-size: 18px;"
              >
                {{ options.statusMessage[params.status] }}
              </div>
            </div>
            <div v-else>
              <div>
                <img
                  src="../images/icon-pay-success.png"
                  alt=""
                  style="width: 130px;"
                />
              </div>
              <div
                class="vc-margin--tp vc-text--bold vc-text--center"
                style="color: #65DA51;font-size: 18px;"
              >
                {{ options.statusMessage[params.status] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="vc-margin__lg--bm" v-if="params.status == 2">
        <div class="vc-margin--bm">
          <span class="vc-text--danger ">
            <span
              >收款后请确认收款，否则收款后15分钟之内不进行确认操作，系统将自动确认收款</span
            >
          </span>
        </div>

        <div class="vp-btn__submit" @click="confirmWithdraw">
          确定收款
        </div>
      </div>

      <div class="vc-margin__lg--bm">
        <div class="">
          <template v-if="options.status[params.status]">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">提现状态</span>
              <span class=" vc-text--lg">{{
                options.status[params.status]
              }}</span>
            </div>
          </template>
          <template v-if="params.money">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">提现金额</span>
              <span class="vc-text--lg ">￥ {{ params.money }}</span>
            </div>
          </template>
          <template v-if="params.payMode">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">提现方式</span>
              <span class=" vc-text--lg">{{ params.payMode }}</span>
            </div>
          </template>

          <template v-if="params.channelOrderId">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">订单编号</span>
              <span class=" vc-text--lg">{{ params.channelOrderId }}</span>
            </div>
          </template>

          <template v-if="params.orderSn">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">流水号</span>
              <span class=" vc-text--lg">{{ params.orderSn }}</span>
            </div>
          </template>

          <template v-if="params.createTime">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">申请时间</span>
              <span class=" vc-text--lg">{{ params.createTime }}</span>
            </div>
          </template>

          <template v-if="params.payTime">
            <div class="vc-flex--between-center vc-padding--ud">
              <span class="vc-text--lg vc-text--gray">到账时间</span>
              <span class=" vc-text--lg">{{ params.payTime }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
