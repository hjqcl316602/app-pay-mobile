<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 11:36:17
 * @LastEditors: Please set LastEditors
 -->
<script>
import Vue from "vue";
import VueQriously from "vue-qriously";
import { Storager, Queryer, Urler } from "store-es";
import VueClipboards from "vue-clipboards";
Vue.use(VueClipboards);
Vue.use(VueQriously);
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
  name: "PagePayAli",

  data() {
    return {
      params: {},
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
    /**
     * 设置二维码的宽度
     */
    setCode() {
      this.$nextTick(() => {
        let codeBox = this.$refs["codeBox"];
        this.payCode.size = codeBox ? codeBox.offsetWidth : 0;
      });
    },
    handleSuccess(e) {
      this.$message.success("复制成功！" + e.text);
    },
    handleError(e) {
      this.$message.success("复制失败！");
    },
    openAli() {
      let test = false;
      if (test) {
        this.$router.push(`/alipay/${this.token}/${this.payType}`);
      } else {
        window.location.href = getAlipayUrl(
          `/alipay/${this.token}/${this.payType}`
        );
      }
    }
  },

  props: {
    backTime: { type: [Number, String] },
    qr: { type: String },
    sn: { type: String },
    fee: { type: [String, Number] },
    payRemark: { type: String },
    payType: { type: [String, Number] },
    token: { type: [String] },
    alipayRealName: { type: String }
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
              class="iconfont icon-zhifubaozhifu vv-text--ali"
              style="font-size:24px"
            ></i>
            <span class="vc-margin__sm--lt" style="font-size:24px">
              支付宝
            </span>
          </p>
          <p class=" ">
            <span style="font-size: 24px;">￥</span>
            <span style="font-size: 30px;" class="vc-text--bold">
              {{ fee | strMoney }}
            </span>
          </p>
          <p>
            <span class="vc-text--gray">{{ sn }}</span>
          </p>
          <template v-if="payType == 3 && payRemark.length !== 6">
            <div class="">
              <span class=" vc-text--bold vc-text--danger vc-text--lg">
                请确保付款金额一致，否则不到账
              </span>
            </div>
          </template>
          <template v-if="payType == 6">
            <div>
              <span class="vc-text--bold vc-text--danger vc-text--lg">
                请勿修改转账信息，否则不到账
              </span>
            </div>
          </template>
          <template v-if="payType == 6">
            <div>
              <span class="vc-text--bold vc-text--xl">
                {{ alipayRealName }}
              </span>
            </div>
          </template>
        </div>
        <div class="vc-text--center vc-margin--bm"></div>

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
                      class="iconfont icon-zhifubaozhifu vv-text--ali"
                      style="font-size: 0.6rem;"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template v-if="payType == 3">
          <div class="vc-margin--bm vc-flex">
            <div class=" vc-text--center vc-flex vc-direction--column ">
              <i
                class="iconfont icon-jieping1 vv-text--ali vc-margin__sm--bm"
              ></i>
              <span class="">将二维码截屏并保存至本地相册 </span>
            </div>
            <div class="vc-padding__sm--ad vc-padding__lg--tp">
              <i class="iconfont icon-jiantou vc-text--sm vv-text--ali"></i>
              <!--<span class="vv-text&#45;&#45;ali">+</span>-->
            </div>
            <div class=" vc-text--center vc-flex vc-direction--column ">
              <i
                class="iconfont icon-changyonglogo30 vv-text--ali vc-margin__sm--bm"
              ></i>

              <span class="">
                打开支付宝选择扫一扫
              </span>
            </div>
            <div class="vc-padding__sm--ad vc-padding__lg--tp">
              <i class="iconfont icon-jiantou vc-text--sm vv-text--ali"></i>
              <!--<i class="iconfont icon-jiantou vc-text&#45;&#45;sm vc-text&#45;&#45;gray"></i>-->
              <!--<span class="vv-text&#45;&#45;ali">+</span>-->
            </div>
            <div class=" vc-text--center vc-flex vc-direction--column ">
              <i
                class="iconfont icon-saoyisao vv-text--ali vc-margin__sm--bm"
              ></i>
              <span class="">从本地相册选取截屏二维码</span>
            </div>
          </div>
        </template>
        <template v-if="false">
          <div class="vc-text--center vc-margin--bm">
            <span class="vc-text--lg"
              >单击下方按钮【支付宝】进入支付宝APP支付即可</span
            >
          </div>
        </template>

        <div class=" vc-margin--bm vc-text--center">
          <span class="vc-text--bold vc-text--danger vc-text--lg">
            有效时间：{{ backTime | strTime }}
          </span>
        </div>

        <div class="vc-text--center vc-margin--bm ">
          <div class="vc-margin__sm--bm">
            <span class="vc-text--danger ">
              付款30秒内即可到账，未到账请联系客服
            </span>
          </div>
          <div class="vc-margin__sm--bm">
            <span class="vc-text--danger ">
              每笔订单的二维码是唯一的，请勿重复支付
            </span>
          </div>
          <div class="vc-margin__sm--bm">
            <span class="vc-text--danger ">
              请在有效时间内支付，超时请勿支付
            </span>
          </div>
        </div>

        <template v-if="payType == 6">
          <div>
            <div
              class="vp-btn vp-btn__submit is-btn--ali"
              style=""
              @click="openAli"
            >
              打开支付宝
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
