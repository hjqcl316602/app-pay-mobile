<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 10:13:21
 * @LastEditors: Please set LastEditors
 -->
<script>
import Vue from "vue";
import { Hexer } from "store-es";
const ALIPAY_TO_ALIPAY = "20000200";
const ALIPAY_TO_CARD = "09999988";
function ready(callback) {
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    document.addEventListener("AlipayJSBridgeReady", callback, false);
  }
}
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
      // if (this.params.payType == 5) {
      //   setTimeout(() => {
      //     this.toCard();
      //   }, 300);
      // }
    },
    handler(payType, type) {
      if (payType === "toAccount") {
        if (type === "alipay") {
          this.toAlipay();
        } else if (type === "scan") {
          this.toScan();
        }
      } else if (payType === "toCard") {
        this.toCard();
      }
    },
    /**
     * @description: 支付宝扫一扫
     * @param {type}
     * @return:
     */
    toScanQr() {
      let self = this;
      ready(function() {
        AlipayJSBridge.call("scan", {
          type: "qr",
          actionType: "scanAndRoute"
        });
      });
    },
    toScan() {
      let self = this;
      ready(function() {
        AlipayJSBridge.call(
          "scan",
          {
            type: "qr"
          },
          function(result) {
            if ("error" in result) return;
            if (
              "imageChannel" in result &&
              result["imageChannel"] === "album"
            ) {
              setTimeout(() => {
                self.$message("不能从相册中选择条形码或二维码");
              }, 300);
            } else {
              setTimeout(() => {
                self.toAlipay();
              }, 300);
            }
          }
        );
      });
    },
    toAlipay() {
      let href = this.params.qr;
      ready(function(params) {
        AlipayJSBridge.call(
          "pushWindow",
          {
            url: href,
            params: {
              closeCurrentWindow: false
            }
          },
          function() {}
        );
      });
    },
    toCard() {
      let cards = this.params.qr.split(",");
      let money = Number(this.params.fee) / 100;
      let cardNo = cards[0];
      let bankName = cards[1];
      let bankAccount = cards[2];
      let bankMark = cards[3];
      let href = `https://www.alipay.com/?appId=${ALIPAY_TO_CARD}&actionType=toCard&sourceId=bill&cardNo=${cardNo}&bankAccount=${bankAccount}&money=${money}&amount=${money}&bankMark=${bankMark}&bankName=${bankName}&orderSource= from`;
      //window.location.href = href;
      ready(function(params) {
        AlipayJSBridge.call(
          "pushWindow",
          {
            url: href,
            params: {
              closeCurrentWindow: false
            }
          },
          function() {}
        );
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
  <div class="vv-page is-cover-hor vc-padding__lg">
    <div class="vc-margin--bm vc-text--center">
      <img src="../images/logo-ali.jpg" alt="" style="height:44px" />
    </div>
    <template v-if="params.payType == 5">
      <div class="vc-margin--bm vc-text--center">
        <div class="vc-margin--bm ">
          <span class="vc-text--danger vc-text--bold">温馨提示</span>
        </div>
        <div class="vc-margin--bm">
          <p style="text-indent:20px;margin-bottom:8px" class="vc-text--danger">
            单击下方按钮【去支付】，如果能正常跳转至转账页面，继续转账即可
          </p>
          <p style="text-indent:20px;margin-bottom:8px" class="vc-text--danger">
            若跳转后出现系统原因导致不能正常转账，您需要返回至该页面后开启手机【飞行/离线模式】，再单击下方按钮【去支付】，跳转至转账页面后再关闭【飞行/离线模式】，等待网络恢复正常后即可继续转账
          </p>
        </div>
      </div>
      <div class="vc-margin--bm vc-text--center">
        <div class="vc-margin--bm ">
          <span class="vc-text--danger vc-text--bold">注意事项</span>
        </div>
        <div>
          <p style="text-indent:20px" class=" ">
            请勿修改转账信息
          </p>
        </div>
      </div>
      <div class="vc-margin--bm">
        <div class="vc-margin--bm vc-text--center">
          <span class="vc-text--danger vc-text--bold">示例如下</span>
        </div>
        <div class="vc-text--center">
          <img src="../images/img-unalive.png" alt="" style="max-width:200px" />
        </div>
      </div>

      <div>
        <div
          class="vp-btn vp-btn__submit is-btn--ali"
          @click="handler('toCard', 'alipay')"
        >
          去支付
        </div>
      </div>
    </template>
    <template v-if="params.payType == 6">
      <div class="vc-margin--bm vc-text--center">
        <div class="vc-margin--bm  ">
          <span class="vc-text--danger vc-text--bold">温馨提示</span>
        </div>
        <div class="vc-margin--bm">
          <p style="text-indent:20px;margin-bottom:8px" class="vc-text--danger">
            单击下方按钮【去支付】，如果能正常跳转至转账页面，继续转账即可
          </p>
          <p style="text-indent:20px;margin-bottom:8px" class="vc-text--danger">
            若跳转后出现系统原因导致不能正常转账，您需要返回至该页面单击下方按钮【扫一扫】，并
            选择您身边随处可见的二维码或条形码，对准其进行扫码，扫码之后若能正常跳转至转账页面，继续转账即可
          </p>
        </div>
      </div>
      <div class="vc-margin--bm vc-text--center">
        <div class="vc-margin--bm ">
          <span class="vc-text--danger vc-text--bold">注意事项</span>
        </div>
        <div>
          <p style="text-indent:20px" class="vc-text--danger">
            请勿修改转账信息
          </p>
          <p style="text-indent:20px" class="vc-text--danger">
            使用扫一扫时，不能从相册中选择条形码或二维码，可选如烟盒，零食，酒水...
          </p>
        </div>
      </div>
      <div class="vc-margin--bm vc-text--center">
        <div class=" ">
          <span class="vc-text--danger vc-text--bold">示例如下</span>
        </div>
        <div class="vc-text--center">
          <img src="../images/icon-code.jpg" alt="" style="height:44px" />
          <img src="../images/icon-qr.jpg" alt="" style="height:44px" />
        </div>
      </div>
      <div
        class="vp-btn vp-btn__submit is-btn--ali"
        @click="handler('toAccount', 'alipay')"
      >
        去支付
      </div>
      <div
        class="vp-btn vp-btn__submit is-btn--hollow"
        @click="handler('toAccount', 'scan')"
      >
        扫一扫
      </div>
    </template>
  </div>
</template>

<style scoped></style>
