<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 09:37:26
 * @LastEditors: Please set LastEditors
 -->
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
import VueClipboards from "vue-clipboards";

Vue.use(VueClipboards);
Vue.use(VueQriously);
export default {
  name: "PagePayWx",
  data() {
    return {
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
  mounted() {
    this.setCode();
  },
  methods: {
    setCode() {
      this.$nextTick(() => {
        let codeBox = this.$refs["codeBox"];
        this.payCode.size = codeBox ? codeBox.offsetWidth : 0;
        this.payCode.value = this.qr;
      });
    },
    handleSuccess(e) {
      this.$message.success("复制成功！" + e.text);
    },
    handleError(e) {
      this.$message.success("复制失败！");
    }
  },

  props: {
    backTime: { type: [Number, String] },
    qr: { type: String },
    sn: { type: String },
    fee: { type: [String, Number] },
    payRemark: { type: String }
  },
  watch: {
    backTime(val) {
      // console.log(val)
    }
  }
};
</script>
<template>
  <div class="vv-page-wrap">
    <div class="vv-page-body">
      <div class="vv-page-content">
        <div class="vc-text--center vc-margin--bm">
          <p class="">
            <i
              class="iconfont icon-weixinzhifu vv-text--wx"
              style="font-size:30px"
            ></i>
            <span class="vc-margin__sm--lt" style="font-size:30px">
              微信
            </span>
          </p>
          <p class=" ">
            <span style="font-size: 30px;">￥</span>
            <span style="font-size: 50px;" class="vc-text--bold">
              {{ fee | strMoney }}
            </span>
          </p>
          <template v-if="payRemark.length !== 6">
            <div class="">
              <span class=" vc-text--bold vc-text--danger vc-text--lg">
                请确保付款金额一致，否则不到账
              </span>
            </div>
          </template>
        </div>
        <div class="vc-margin--bm">
          <div
            class="vp-ratio"
            style="margin: 0 auto;width:100%;max-width: 200px"
          >
            <div class="vp-ratio__outer" data-ratio="100%">
              <div
                class="vp-ratio__inner vp-bg vp-br  vp-pos"
                ref="codeBox"
                v-if="qr"
              >
                <qriously
                  :value="qr"
                  :size="payCode.size"
                  :level="payCode.level"
                  :background="payCode.background"
                  :foreground="payCode.foreground"
                  :backgroundAlpha="payCode.backgroundAlpha"
                />

                <div
                  style=""
                  class=" vp-bg vp-pos--inner vp-pos--center vp-br vc-padding__sm"
                >
                  <div class="vc-cover vp-img__inner" v-if="false">
                    <!--<img src="../images/icon-head-normal.png" alt="" class="vp-img&#45;&#45;cover">-->
                    <i
                      class="iconfont icon-weixinzhifu vv-text--wx"
                      style="font-size: 0.6rem;"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="vc-flex vc-margin--bm">
          <div class=" vc-text--center vc-flex vc-direction--column ">
            <i class="iconfont icon-jieping1 vv-text--wx vc-margin__sm--bm"></i>
            <span>将二维码截屏并保存至本地相册 </span>
          </div>
          <div class="vc-padding__sm--ad vc-padding__lg--tp">
            <i class="iconfont icon-jiantou vc-text--sm vv-text--wx"></i>
          </div>
          <div class=" vc-text--center vc-flex vc-direction--column ">
            <i
              class="iconfont icon-weixinzhifu vv-text--wx vc-margin__sm--bm"
            ></i>

            <span class="">
              打开微信选择扫一扫
            </span>
          </div>
          <div class="vc-padding__sm--ad vc-padding__lg--tp">
            <i class="iconfont icon-jiantou vc-text--sm vv-text--wx"></i>
          </div>
          <div class=" vc-text--center vc-flex vc-direction--column ">
            <i class="iconfont icon-saoyisao vv-text--wx vc-margin__sm--bm"></i>
            <span>从本地相册选取截屏二维码</span>
          </div>
        </div>
        <div class="vc-text--center  ">
          <div class="vc-margin__sm--bm">
            <span class=" vc-text--danger ">
              付款30秒内即可到账，未到账请联系客服
            </span>
          </div>

          <div class="vc-margin__sm--bm">
            <span class=" vc-text--danger ">
              每笔订单的二维码是唯一的，请勿重复支付
            </span>
          </div>
          <div class="vc-margin__sm--bm">
            <span class=" vc-text--danger ">
              过期订单请勿支付
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
