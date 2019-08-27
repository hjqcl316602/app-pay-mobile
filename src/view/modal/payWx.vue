<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 09:37:26
 * @LastEditors: Please set LastEditors
 -->
<script type="text/ecmascript-6">
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
  <div class="vv-page">
    <div class="vc-flex--center vv-mask" v-if="backTime === 0">
      <div>
        <div class="vc-text--center vc-text--white" style="font-size: 50px">
          已过期
        </div>
      </div>
    </div>
    <div
      class="vc-fluid--h-min vc-flex--center vv-bg--wx  "
      style="padding: 20px 20px 80px"
    >
      <div class="vv-pay__body--outer">
        <div class="vv-pay__body--inner wx vp-bg">
          <div class="vv-pay__content wx vc-padding__lg ">
            <div class="vc-text--center vc-margin--bm">
              <span class="vc-text--gray ">订单号:{{ sn }}</span>
            </div>
            <div class="" style="">
              <div class="vc-text--center vc-margin--bm">
                <p
                  v-clipboard="Number(fee) / 100"
                  @success="handleSuccess"
                  @error="handleError"
                >
                  <span style="font-size: 40px;">￥</span>
                  <span style="font-size: 1rem;">{{ fee | strMoney }}</span>
                </p>
                <template v-if="payRemark.length !== 6">
                  <p>
                    <span class="vc-text--bold vc-text--danger   vc-text--xl">
                      请确保付款金额与该金额一致
                    </span>
                  </p>
                  <div v-if="payRemark.length == 4">
                    <p class=" ">
                      <span class="vc-text--bold vc-text--danger   vc-text--xl">
                        必须在转账备注中添加付款码
                      </span>
                    </p>
                    <p>
                      <span
                        class="vc-text--bold vc-text--xl"
                        v-clipboard="payRemark"
                        @success="handleSuccess"
                        @error="handleError"
                      >
                        付款码：
                        <span class="vc-text--bold vc-text--xl-xx">{{
                          payRemark
                        }}</span>
                      </span>
                    </p>
                  </div>
                </template>
              </div>
              <div class="vp-ratio">
                <div class="vp-ratio__outer" data-ratio="100%">
                  <div
                    class="vp-ratio__inner vp-bg vp-br  vp-pos"
                    ref="codeBox"
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
                      <div class="vc-cover vp-img__inner">
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
              <div
                v-clipboard="payRemark"
                @success="handleSuccess"
                @error="handleError"
                class=""
                v-if="false"
              >
                <div class="vc-text--center">
                  <span
                    class="vc-text--bold vc-text--lg vc-text--baseline--md"
                    >{{ payRemark }}</span
                  >
                </div>
                <div class="vc-text--center">
                  <span class="vc-text--gray vc-text--mi"
                    >(转账时请务必添加上该备注，否则充值不成功，轻触可复制)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class=" vc-padding">
            <div class="vc-flex">
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-jieping1 vv-text--wx vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >将二维码截屏并保存至本地相册
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--wx"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-weixin vv-text--wx vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >打开微信选择扫一扫
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--wx"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-saoyisao vv-text--wx vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >从本地相册选取截屏二维码</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="vc-margin__lg--tp">
          <!-- <div class="vc-text--center">
            <span class="vc-text--white-light  ">
              过期时间
            </span>
          </div> -->
          <div
            class="vc-text--white vc-text--bold vc-text--center vc-margin--tp"
          >
            <span class="vc-text--white vc-text--bold  ">
              <span class="vc-text--white-light">倒计时：</span>
              {{ backTime | strTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
