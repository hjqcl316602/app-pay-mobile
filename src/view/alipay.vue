<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-20 12:00:58
 * @LastEditors: Please set LastEditors
 -->
<script>
import Vue from "vue";
import { Hexer } from "store-es";
const ALIPAY_TO_ALIPAY = "20000200";
const ALIPAY_TO_CARD = "09999988";
export default {
  name: "alipay",
  data() {
    return {
      params: {
        token: "",
        payType: ""
      }
    };
  },
  methods: {
    initialize() {
      this.params = Object.assign(this.params, this.$route.params);
      this.params = Object.assign(this.params, this.analysisToken());
      this.params.payType == 6 || this.params.payType == 3
        ? this.toAlipay()
        : this.toCard();
    },
    toAlipay() {
      let money = Number(this.params.fee) / 100;
      // let account = "920508536@qq.com";
      // let userId = "2088302213183605";
      // let memo = "hjhjh";
      //let search = `alipays://platformapi/startapp?appId=${ALIPAY_TO_ALIPAY}&actionType=toAccount&account=${account}&amount=${money}&userId=${userId}&memo=${memo}`;
      let href = this.params.qr;
      window.location.href = href;
    },
    toCard() {
      let cards = this.params.qr.split(",");
      let money = Number(this.params.fee) / 100;
      let cardNo = cards[0];
      let bankName = cards[1];
      let bankAccount = cards[2];
      let bankMark = cards[3];
      let href = `https://www.alipay.com/?appId=${ALIPAY_TO_CARD}&actionType=toCard&sourceId=bill&cardNo=${cardNo}&bankAccount=${bankAccount}&money=${money}&amount=${money}&bankMark=${bankMark}&bankName=${bankName}&orderSource= from`;
      window.location.href = href;
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
        console.log(e);
        this.$router.replace({
          name: "Error",
          query: { msg: "异常，请重试或联系客服！" }
        });
      }
    }
  },
  created() {
    this.initialize();
  }
};
</script>

<template>
  <div class="vv-page"></div>
</template>

<style   scoped>
</style>