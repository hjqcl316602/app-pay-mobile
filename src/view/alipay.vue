<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-16 18:43:20
 * @LastEditors: Please set LastEditors
 -->
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
Vue.use(VueQriously);
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
        amount: params.money,
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
  function returnApp() {
    AlipayJSBridge.call("exitApp");
  }

  function ready(a) {
    window.AlipayJSBridge
      ? a && a()
      : document.addEventListener("AlipayJSBridgeReady", a, !1);
  }
  ready(function() {
    try {
      var a = {
        actionType: "scan",
        u: params.userId,
        a: params.money,
        m: params.memo,
        biz_data: {
          s: "money",
          u: params.userId,
          a: params.money,
          m: params.memo
        }
      };
    } catch (b) {
      returnApp();
    }
    AlipayJSBridge.call(
      "startApp",
      {
        appId: APPID_TO_ACCOUNT,
        param: a
      },
      function(a) {}
    );
  });
  document.addEventListener("resume", function(a) {
    returnApp();
  });
}

export default {
  name: "alipay",
  data() {
    return {
      message: "",
      status: true,
      qr:
        "https://ds.alipay.com/?from=mobilecodec&scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000200%26actionType%3DtoAccount%26account%3D13980464237%26amount%3D100%26userId%3D2088002357544150",
      payCode: {
        value: "",
        size: 300,
        backgroundAlpha: 1,
        background: "white",
        foreground: "black",
        level: "H"
      }
    };
  },
  mounted() {
    // setTimeout(() => {
    //   let href =
    //     "https://ds.alipay.com/?from=mobilecodec&scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000200%26actionType%3DtoAccount%26account%3D13980464237%26amount%3D100%26userId%3D2088802680692010";
    //   //alert(href);
    //   window.location.href = href;
    // }, 500);
    // this.$nextTick(() => {
    //   let query = this.$route.query || {};
    //   //alert(JSON.stringify(query));
    //   try {
    //     this.status = true;
    //     query["type"] === "toCard"
    //       ? toCardPay(query)
    //       : query["type"] === "toAccount"
    //       ? toAccountPay(query)
    //       : void 0;
    //   } catch (e) {
    //     this.status = false;
    //     this.message = "支付失败，请重试！";
    //   }
    // });
  },
  methods: {
    selectSide(type) {
      if (type === "scan") {
        alipayReady(() => {
          AlipayJSBridge.call(
            "scan",
            {
              type: "qrcode",
              actionType: "scanAndRoute"
              //qrcode
            },
            function(value) {
              //alert(JSON.stringify(value));
            }
          );
        });
      } else if (type === "jump") {
        window.location.href = this.qr;
      }
    }
  }
};
</script>

<template>
  <div class="vv-page">
    <div class="vv-side">
      <div class="vv-side-item vc-text--theme" @click="selectSide('scan')">
        <span>扫一扫</span>
        <i class="iconfont icon-saoyisao" style="font-size:16px"></i>
      </div>
      <div class="vv-side-item vc-text--danger" @click="selectSide('jump')">
        <span>跳转</span>
        <i class="iconfont icon-jiantou" style="font-size:16px"></i>
      </div>
    </div>
    <div
      class="vc-fluid--h-min vp-bg vc-padding__lg vc-flex--center"
      style="padding-bottom:70px"
    >
      <div>
        <div class="vc-text--center vc-padding__lg">
          <img
            v-if="true"
            src="../images/code6.png"
            alt=""
            style="max-width:100%;max-height:400px"
          />
          <qriously
            v-if="false"
            :value="qr"
            :size="payCode.size"
            :level="payCode.level"
            :background="payCode.background"
            :foreground="payCode.foreground"
            :backgroundAlpha="payCode.backgroundAlpha"
          />
        </div>
        <div>
          <p class="vc-text--danger vc-text--baseline--md vc-text--bold">
            识别方式：
          </p>
          <p
            class="vc-text--danger vc-text--baseline--md"
            style="text-indent:20px"
          >
            ①长按二维码识别
          </p>
          <p
            class="vc-text--danger vc-text--baseline--md"
            style="text-indent:20px"
          >
            ②单击下方跳转按钮直接跳转
          </p>
          <p
            class="vc-text--danger vc-text--baseline--md"
            style="text-indent:20px"
          >
            ③长按二维码保存或截屏，单击下方扫一扫按钮识别二维码
          </p>
          <p class="vc-text--danger vc-text--baseline--md vc-text--bold">
            温馨提示：
          </p>
          <p
            class="vc-text--danger vc-text--baseline--md"
            style="text-indent:20px"
          >
            如若前两种方式识别出现异常，请切换至第三种方式，若三种方式均失败请更换充值方式
          </p>
        </div>
      </div>
    </div>

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