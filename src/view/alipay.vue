<script>
const TYPE_PAY = ["toCard", "toAccount"];
const APPID_TO_CARD = "09999988";
const APPID_TO_ACCOUNT = "20000123";
/**
 * 调用支付宝API前初始化
 */
function alipayReady(callback) {
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    document.addEventListener("AlipayJSBridgeReady", callback, false);
  }
}
/**
 * 支付宝转账到银行卡
 */
function toCardPay(params) {
  alipayReady(function() {
    AlipayJSBridge.call("startApp", {
      appId: APPID_TO_CARD,
      param: {
        actionType: "toCard",
        cardNo: params.cardNo,
        bankAccount: params.bankAccount,
        money: params.money,
        bankMark: params.bankMark,
        bankName: params.bankName // 该参数不是必填项
      }
    });
  });
}
/**
 * 支付宝转账支付宝账号
 */
function toAccountPay(params) {
  alipayReady(function() {
    AlipayJSBridge.call("startApp", {
      appId: APPID_TO_ACCOUNT,
      param: {
        actionType: "scan",
        // u: params.userId,
        // a: params.money,
        // m: params.memo,
        biz_data: {
          s: "money",
          u: params.userId,
          a: params.money,
          m: params.memo, 
        }
      }
    });
  });
}

export default {
  name: "alipay",
  data() {
    return {
      message: "",
      status: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      let query = this.$route.query || {};
      //alert(JSON.stringify(query));
      try {
        this.status = true;

        query["type"] === "toCard"
          ? toCardPay(query)
          : query["type"] === "toAccount"
          ? toAccountPay(query)
          : void 0;
      } catch (e) {
        this.status = false;
        this.message = "支付失败，请重试！";
      }
    });
  }
};
</script>

<template>
  <div class="app-alipay">
    <div v-if="!status">
      <div v-css="{ textAlign: 'center', marginBottom: 'large' }">
        <img src="../images/icon-pay-error.png" alt="" style="width: 30px;" />
      </div>
      <span v-css="{ color: 'danger' }">{{ message }}</span>
    </div>
  </div>
</template>

<style   scoped>
.app-alipay {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>