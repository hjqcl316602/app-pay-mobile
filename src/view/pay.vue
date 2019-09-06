<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 11:36:03
 * @LastEditors: Please set LastEditors
 -->
<script type="text/ecmascript-6">
import Vue from "vue";
import { getOrderMessage, cancelOrder } from "../request";
import {
  payCard,
  payAli,
  payWx,
  payUnion,
  payAliQuick,
  payCardQuick
} from "./index.js";
import { Hexer, Urler, Queryer } from "store-es";
import { Confirm } from "store-vue-ui";
Vue.use(Confirm);

const APPID_TO_ALIPAY = "20000067";
/**
 * 跳转到支付宝内部，指定的路径和参数的传递
 */
function getAlipayUrl(path) {
  let query = new Queryer();
  let urler = new Urler();
  let href = window.location.href;
  let index = href.indexOf("#");
  let url = urler.encodeURIComponent(href.substring(0, index + 1) + path);
  return `alipays://platformapi/startapp?appId=${APPID_TO_ALIPAY}&url=${url}`;
}
export default {
  name: "PagePays",
  components: { payCard, payAli, payWx, payUnion, payAliQuick, payCardQuick },
  data() {
    return {
      isShow: false, // 是否显示支付页面
      params: {
        payType: 4,
        token: "",
        accessToken: "",
        appId: "",
        fee: "",
        sn: "",
        timeLimit: 0,
        qr: "",
        needRemark: "",
        payRemark: "",
        orderId: ""
      },
      timer: {
        payStatus: null,
        payStatusDuration: 5 * 1000,
        payTime: null,
        payTimeDuration: 1 * 1000
      },
      cancel: {
        popup: false
      }
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    /**
     * 页面进入
     * 1.首先得到url参数 payType token accessToken
     * 2.token解析
     * 3.通过accessToken去获取该订单的详情，并判断当前订单的状态，如果是0，则表示取消，3表示成功，其他状态则定时再获取
     * 4.定时获取订单的详情
     */
    async initialize() {
      this.params = Object.assign(this.params, this.$route.params);
      this.params = Object.assign(this.params, this.analysisToken());
      console.log(this.params);

      //console.log(this.analysisToken());
      this.getOrderMessage();
      this.setTimer("payStatus");
    },

    /*
     *获取订单的支付信息
     * init 是否是第一次调用，第一次则将开始计算倒计时
     * 若状态是取消和完成付款，则跳转到状态的页面即可
     */
    getOrderMessage(init = true) {
      getOrderMessage(
        { accessToken: this.params.accessToken },
        init ? 2 : 1
      ).then(message => {
        let status = message["status"];
        this.params.orderId = message["orderId"];

        if (status === 0 || status === 3) {
          setTimeout(() => {
            this.$router.replace({
              name: "PayStatus",
              params: {
                accessToken: this.params.accessToken,
                appId: this.params.appId
              }
            });
          }, 50);
        } else {
          if (init) {
            this.params.timeLimit = message["leftTime"]
              ? message["leftTime"] * 1000
              : 0;
            this.params.timeLimit > 0 && this.setTimer("payTime");
            this.isShow = true;
          }
        }
      });
    },
    /**
     * 解析token，16进制转化为字符串
     */
    analysisToken() {
      try {
        let hex = new Hexer();
        let hexToString = hex.decodeComponent(this.params.token);
        let message = JSON.parse(hexToString);
        return message;
      } catch (e) {
        this.$router.replace({
          name: "Error",
          query: { msg: "异常，请重试或联系客服！" }
        });
      }
    },
    /**
     * 设置定时器
     * type 是指定时器的类型 [payStatus,payTime]
     */
    setTimer(type) {
      this.clearTimer(type);
      if (type == "payTime") {
        this.timer.payTime = null;
        this.timer.payTime = setInterval(() => {
          this.params.timeLimit = this.params.timeLimit - 1000;
          if (this.params.timeLimit === 0) {
            this.clearTimer("payTime");
          }
        }, this.timer.payTimeDuration);
      } else if (type == "payStatus") {
        this.timer.payStatus = null;
        this.timer.payStatus = setInterval(() => {
          this.getOrderMessage(false);
        }, this.timer.payStatusDuration);
      }
    },
    /**
     * 清除定时器
     */
    clearTimer(type) {
      clearInterval(this.timer[type]);
      this.timer[type] = null;
    },
    selectSide(type) {
      if (type === "cancel") {
        this.cancel.popup = true;
      } else if (type === "customer") {
        this.$router.push({
          name: "CustomDetail",
          params: {
            appId: this.params.appId,
            accessToken: this.params.accessToken
          },
          query: { orderId: this.params.orderId }
        });
      } else if (type === "alipay") {
        let test = false;
        if (test) {
          this.$router.push(
            `/alipay/${this.params.token}/${this.params.payType}`
          );
        } else {
          window.location.href = getAlipayUrl(
            `/alipay/${this.params.token}/${this.params.payType}`
          );
        }
      } else if (type === "wx") {
        window.location.href = "weixin://";
      }
    },
    cancelOrder() {
      cancelOrder({ accessToken: this.params.accessToken }).then(res => {
        console.log(res);
        setTimeout(() => {
          this.$router.replace({
            name: "PayStatus",
            params: {
              accessToken: this.params.accessToken,
              appId: this.params.appId
            }
          });
        }, 50);
      });
    }
  },
  // 页面离开时清除定时器
  beforeDestroy() {
    this.clearTimer("payTime");
    this.clearTimer("payStatus");
  }
};
</script>
<template>
  <div v-if="isShow">
    <vui-confirm v-model="cancel.popup" title="信息确认" @ok="cancelOrder">
      <div class="vc-padding vc-text--center">
        <span class="vc-text--danger">是否确定取消该充值订单?</span>
      </div>
    </vui-confirm>
    <div class="vv-side">
      <div
        class="vv-side-item vv-text--wx"
        @click="selectSide('wx')"
        v-if="params.payType == 2"
      >
        <span class="vc-text--bold">微信</span>
        <i class="iconfont icon-jiantou" style="font-size:16px"></i>
      </div>
      <div
        class="vv-side-item vv-text--ali"
        @click="selectSide('alipay')"
        v-if="params.payType == 5 || params.payType == 6"
      >
        <span class="vc-text--bold">支付宝</span>
        <i class="iconfont icon-jiantou" style="font-size:16px"></i>
      </div>
      <div class="vv-side-item vc-text--danger" @click="selectSide('cancel')">
        <span class="vc-text--bold">取消</span>
        <i class="iconfont icon-quxiao" style="font-size:16px"></i>
      </div>
      <div
        class="vv-side-item vc-text--warning"
        @click="selectSide('customer')"
        v-if="false"
      >
        <span class="vc-text--bold">客服</span>
        <i class="iconfont icon-customer" style="font-size:16px"></i>
      </div>
    </div>

    <payCard
      v-if="params.payType == 1 || params.payType == 5"
      :qr="params.qr"
      :backTime="params.timeLimit"
      :sn="params.sn"
      :fee="params.fee"
      :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
      :payType="params.payType"
      ref="payCard"
    ></payCard>
    <payWx
      v-if="params.payType == 2"
      :qr="params.qr"
      :backTime="params.timeLimit"
      :sn="params.sn"
      :fee="params.fee"
      :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
    ></payWx>
    <template v-if="params.payType == 3 || params.payType == 6">
      <payAli
        :qr="params.qr"
        :backTime="params.timeLimit"
        :sn="params.sn"
        :fee="params.fee"
        :alipayRealName="params.alipayRealName"
        :url="params.url"
        :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
        :payType="params.payType"
        :token="params.token"
        ref="payAli"
      ></payAli>
    </template>
    <template v-if="params.payType == 4">
      <payUnion
        :qr="params.qr"
        :backTime="params.timeLimit"
        :sn="params.sn"
        :fee="params.fee"
        :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
      ></payUnion>
    </template>
    <!-- <template v-if="params.payType == 5 && isShow">
      <payCardQuick
        :qr="params.qr"
        :backTime="params.timeLimit"
        :sn="params.sn"
        :fee="params.fee"
        :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
      ></payCardQuick>
    </template> -->
    <!-- <template v-if="params.payType == 6 && isShow">
      <payAliQuick
        :qr="params.qr"
        :backTime="params.timeLimit"
        :sn="params.sn"
        :fee="params.fee"
        :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
      ></payAliQuick>
    </template> -->
  </div>
</template>
<style scoped>
</style>
