<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-17 17:48:01
 * @LastEditors: Please set LastEditors
 -->
<script>
import Vue from "vue";
import { Hexer, Urler, Queryer } from "store-es";
import VueQriously from "vue-qriously";

Vue.use(VueQriously);

function readyAlipay(callback) {
  // 如果jsbridge已经注入则直接调用
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    // 如果没有注入则监听注入的事件
    document.addEventListener("AlipayJSBridgeReady", callback, false);
  }
}
export default {
  name: "alipay",
  data() {
    return {
      params: {
        token: "",
        qr: "",
        image: "",
        payType: "",
        loading: "loading"
      },
      payCode: {
        value: "",
        size: 300,
        backgroundAlpha: 1,
        background: "white",
        foreground: "black",
        level: "L"
      }
    };
  },
  methods: {
    initialize() {
      this.params.loading = "loading";
      this.params = Object.assign(this.params, this.$route.params);
      this.params = Object.assign(this.params, this.analysisToken());
      let qrs = this.params["qr"] ? this.params["qr"].split(",") : [];
      this.params.qr = qrs[0] || "";

      this.params.image = qrs[1] || "";
      let image = new Image();
      image.src = this.params.image;

      image.onload = e => {
        setTimeout(() => {
          this.params.loading = "loaded";
        }, 500);
      };
      image.onerror = e => {
        this.params.loading = "error";
      };
      // if (this.params.payType == 3) {
      //   setTimeout(() => {
      //     readyAlipay(function() {
      //       AlipayJSBridge.call(
      //         "scan",
      //         {
      //           type: "qr",
      //           actionType: "scanAndRoute" // 跳转到结果
      //         },
      //         function(result) {}
      //       );
      //     });
      //   }, 0);
      // }
    },
    getImage() {
      let canvas = document.getElementsByTagName("canvas");
      console.log(canvas);

      setTimeout(() => {
        console.log(canvas.toDataURL("image/png"));
      }, 100);
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
    }
  },
  mounted() {
    this.initialize();
    setTimeout(() => {
      this.getImage();
    }, 2000);
  }
};
</script>

<template>
  <div class="vv-page">
    <div
      class="vc-fluid--h-min vc-flex--center vp-bg vc-padding__lg"
      v-if="params.payType == 6"
    >
      <!-- <qriously
        :value="params.qr"
        :size="payCode.size"
        :level="payCode.level"
        :background="payCode.background"
        :foreground="payCode.foreground"
        :backgroundAlpha="payCode.backgroundAlpha"
      /> -->
      <!-- <img
        src="http://trade.bstchain.com/upload/e346c41c-0466-44be-b782-a9a829ee6c20.jpg"
        alt=""
        style="max-width:100%;"
      /> -->
      <!-- <img src="../images/code3.jpg" alt="" style="max-width:100%" /> -->
      <div v-if="false">
        <div class="vc-margin--bm">
          <div
            class="vc-flex--center"
            v-if="params.loading === 'loading'"
            style="height:200px"
          >
            <div class="">
              <div class="vc-text--center vc-margin--bm">
                <van-loading></van-loading>
              </div>
              <div class="vc-text--center">
                <span class="vc-text--light">图片加载中...</span>
              </div>
            </div>
          </div>
          <div v-if="params.loading === 'loaded'">
            <img :src="this.params.image" alt="" style="max-width:100%;" />
          </div>
          <div v-if="params.loading === 'error'">
            <div class="vc-text--center">
              <span class="vc-text--danger">图片加载失败</span>
            </div>
          </div>
        </div>
        <div>
          <p class="vc-text--danger vc-text--bold vc-text--center">
            长按二维码识别
          </p>
          <p class="vc-text--danger vc-text--center">
            如若不能识别二维码，请长按保存图片或截频保存至相册，打开扫一扫，
            从本地相册选取该图片进行识别
          </p>
        </div>
      </div>
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