<script type="text/ecmascript-6">
import { getOrderMessage } from "../request";
import {
  payCard,
  payAli,
  payWx,
  payUnion,
  payAliQuick,
  payCardQuick
} from "./index.js";
import { Hexer, Urler, Queryer } from "store-es";

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
        fee: "",
        sn: "",
        timeLimit: 0,
        qr: "",
        needRemark: "",
        payRemark: ""
      },
      timer: {
        payStatus: null,
        payStatusDuration: 5 * 1000,
        payTime: null,
        payTimeDuration: 1 * 1000
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

        if (status === 0 || status === 3) {
          setTimeout(() => {
            this.$router.replace({
              name: "PayStatus",
              params: { accessToken: this.params.accessToken }
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
  <div>
    <payCard
      v-if="(params.payType == 1 || params.payType == 5) && isShow"
      :qr="params.qr"
      :backTime="params.timeLimit"
      :sn="params.sn"
      :fee="params.fee"
      :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
      :payType="params.payType"
    ></payCard>
    <payWx
      v-if="params.payType == 2 && isShow"
      :qr="params.qr"
      :backTime="params.timeLimit"
      :sn="params.sn"
      :fee="params.fee"
      :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
    ></payWx>
    <template v-if="(params.payType == 3 || params.payType == 6) && isShow">
      <payAli
        :qr="params.qr"
        :backTime="params.timeLimit"
        :sn="params.sn"
        :fee="params.fee"
        :payRemark="params.needRemark === 'true' ? params.payRemark : ''"
        :payType="params.payType"
      ></payAli>
    </template>
    <template v-if="params.payType == 4 && isShow">
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
